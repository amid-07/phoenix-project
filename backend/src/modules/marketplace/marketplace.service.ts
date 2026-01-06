import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MarketplaceService {
  
  // --- 1. LISTE DES COACHS (Annuaire) ---
  async getAllCoaches() {
    return await prisma.user.findMany({
      where: { role: 'COACH' },
      include: { 
        professionalProfile: true 
      },
    });
  }

  // --- 2. DÉTAILS D'UN COACH (Fiche complète) ---
  async getCoachDetails(coachUserId: string) {
    const coach = await prisma.user.findUnique({
      where: { id: coachUserId },
      include: {
        professionalProfile: {
          include: {
            // Créneaux libres et futurs uniquement
            availabilities: {
              where: { 
                isBooked: false,
                date: { gte: new Date() } 
              },
              orderBy: { date: 'asc' }
            },
            // Avis clients
            reviews: {
              orderBy: { createdAt: 'desc' },
              include: { 
                author: { select: { username: true } } 
              }
            }
          }
        }
      }
    });
    return coach;
  }

  // --- 3. AJOUTER UN AVIS ---
  async addReview(userId: string, coachId: string, rating: number, comment: string) {
    const coach = await prisma.user.findUnique({
      where: { id: coachId },
      include: { professionalProfile: true }
    });

    if (!coach || !coach.professionalProfile) {
      throw new Error("Coach introuvable");
    }

    return await prisma.review.create({
      data: {
        rating,
        comment,
        authorId: userId,
        profileId: coach.professionalProfile.id
      }
    });
  }

  // --- 4. AJOUTER UNE DISPONIBILITÉ (Avec Type Visio/Cabinet) ---
  // type = 'REMOTE' ou 'IN_PERSON'
  async addAvailability(userId: string, dateString: string, type: 'REMOTE' | 'IN_PERSON') {
    console.log(`📅 Ajout dispo pour ${userId} : ${dateString} (${type})`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: true }
    });

    if (!user || !user.professionalProfile) {
      throw new Error("Profil pro introuvable");
    }

    return await prisma.availability.create({
      data: {
        date: new Date(dateString),
        isBooked: false,
        type: type, // On enregistre le type de séance
        profileId: user.professionalProfile.id
      }
    });
  }

  // --- 5. VOIR SES PROPRES DISPOS (Côté Coach) ---
  async getCoachAvailabilities(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: true }
    });
    
    if (!user?.professionalProfile) return [];

    return await prisma.availability.findMany({
      where: { 
        profileId: user.professionalProfile.id,
        isBooked: false,
        date: { gte: new Date() }
      },
      orderBy: { date: 'asc' }
    });
  }

  // --- 6. METTRE À JOUR L'ADRESSE DU CABINET ---
  async updateAddress(userId: string, address: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: true }
    });

    if (!user?.professionalProfile) throw new Error("Profil introuvable");

    return await prisma.professionalProfile.update({
      where: { id: user.professionalProfile.id },
      data: { address: address }
    });
  }
}