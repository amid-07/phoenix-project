import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MarketplaceService {
  
  // 1. Récupérer la liste simple de tous les coachs
  async getAllCoaches() {
    return await prisma.user.findMany({
      where: { role: 'COACH' },
      include: { 
        professionalProfile: true 
      },
    });
  }

  // 2. Récupérer les détails complets d'un coach (Créneaux + Avis)
  async getCoachDetails(coachUserId: string) {
    const coach = await prisma.user.findUnique({
      where: { id: coachUserId },
      include: {
        professionalProfile: {
          include: {
            // On inclut les créneaux DISPONIBLES seulement
            availabilities: {
              where: { isBooked: false },
              orderBy: { date: 'asc' }
            },
            // On inclut les avis
            reviews: {
              orderBy: { createdAt: 'desc' },
              include: { 
                author: { select: { username: true } } // On veut le nom de celui qui a noté
              }
            }
          }
        }
      }
    });
    return coach;
  }

  // 3. Ajouter un avis
  async addReview(userId: string, coachId: string, rating: number, comment: string) {
    // On trouve le profil professionnel du coach via son ID utilisateur
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
}