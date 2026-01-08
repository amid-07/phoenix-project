import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MarketplaceService {
  
  // --- 1. LISTE DE TOUS LES COACHS (Basique) ---
  async getAllCoaches() {
    return await prisma.user.findMany({
      where: { role: 'COACH' },
      include: { 
        professionalProfile: true 
      },
    });
  }

  // --- 2. RECHERCHE AVANCÉE (Filtrer par Ville, Type, Nom) ---
  async searchCoaches(query: { search?: string; city?: string; type?: 'REMOTE' | 'IN_PERSON' }) {
    const { search, city, type } = query;

    return await prisma.user.findMany({
      where: {
        role: 'COACH',
        professionalProfile: {
          AND: [
            // A. Filtre Texte (Nom, Titre ou Bio)
            search ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } },
                { user: { username: { contains: search, mode: 'insensitive' } } }
              ]
            } : {},
            
            // B. Filtre Ville (via l'adresse)
            city ? { address: { contains: city, mode: 'insensitive' } } : {},
            
            // C. Filtre Type de Séance (A-t-il des créneaux de ce type ?)
            type ? {
              availabilities: {
                some: { type: type, isBooked: false }
              }
            } : {}
          ]
        }
      },
      include: { professionalProfile: true },
    });
  }

  // --- 3. DÉTAILS COMPLETS D'UN COACH ---
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

  // --- 4. MISE À JOUR DU PROFIL COACH ---
  async updateCoachProfile(userId: string, data: any) {
    // On trouve d'abord le profil ID via le User ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: true }
    });

    if (!user || !user.professionalProfile) {
      throw new Error("Profil introuvable");
    }

    // Mise à jour
    return await prisma.professionalProfile.update({
      where: { id: user.professionalProfile.id },
      data: {
        title: data.title,
        bio: data.bio,
        hourlyRate: parseFloat(data.hourlyRate),
        address: data.address,
        // Si specialties est envoyé, on s'assure que c'est un tableau
        specialties: data.specialties 
      }
    });
  }

  // --- 5. AJOUTER UN AVIS ---
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

  // --- 6. GESTION DES DISPONIBILITÉS (COACH) ---
  
  // Ajouter un créneau
  async addAvailability(userId: string, dateString: string, type: 'REMOTE' | 'IN_PERSON') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: true }
    });

    if (!user || !user.professionalProfile) throw new Error("Profil pro introuvable");

    return await prisma.availability.create({
      data: {
        date: new Date(dateString),
        isBooked: false,
        type: type,
        profileId: user.professionalProfile.id
      }
    });
  }

  // Voir ses créneaux
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

  // Mise à jour adresse simple (Gardé pour compatibilité)
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