import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MarketplaceService {
  
  // --- 1. LISTE DES COACHS (Pour l'annuaire) ---
  async getAllCoaches() {
    return await prisma.user.findMany({
      where: { role: 'COACH' },
      include: { 
        professionalProfile: true 
      },
    });
  }

  // --- 2. DÉTAILS D'UN COACH (Pour la fiche patient) ---
  async getCoachDetails(coachUserId: string) {
    const coach = await prisma.user.findUnique({
      where: { id: coachUserId },
      include: {
        professionalProfile: {
          include: {
            // On récupère les créneaux libres et futurs
            availabilities: {
              where: { 
                isBooked: false,
                date: { gte: new Date() } // Uniquement les dates futures
              },
              orderBy: { date: 'asc' }
            },
            // On récupère les avis
            reviews: {
              orderBy: { createdAt: 'desc' },
              include: { 
                author: { select: { username: true } } // Nom de l'auteur
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
    // On cherche le profil pro du coach
    const coach = await prisma.user.findUnique({
      where: { id: coachId },
      include: { professionalProfile: true }
    });

    if (!coach || !coach.professionalProfile) {
      throw new Error("Coach introuvable ou sans profil pro");
    }

    return await prisma.review.create({
      data: {
        rating: rating,
        comment: comment,
        authorId: userId,
        profileId: coach.professionalProfile.id
      }
    });
  }

  // --- 4. AJOUTER UNE DISPONIBILITÉ (Côté Coach) ---
  async addAvailability(userId: string, dateString: string) {
    console.log(`📅 Ajout dispo pour le coach ${userId} à la date : ${dateString}`);

    // On récupère le profil pro
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: true }
    });

    if (!user || !user.professionalProfile) {
      throw new Error("Profil professionnel introuvable. Êtes-vous bien un coach ?");
    }

    // Création du créneau
    return await prisma.availability.create({
      data: {
        date: new Date(dateString),
        isBooked: false,
        profileId: user.professionalProfile.id
      }
    });
  }

  // --- 5. VOIR SES PROPRES CRÉNEAUX LIBRES (Côté Coach) ---
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
        date: { gte: new Date() } // Seulement le futur
      },
      orderBy: { date: 'asc' }
    });
  }
}