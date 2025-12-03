import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BookingsService {
  
  // Créer une réservation
  async createBooking(patientId: string, coachId: string, dateString: string) {
    console.log(`📅 Nouvelle réservation pour le : ${dateString}`);
    
    return await prisma.booking.create({
      data: {
        patientId: patientId,
        coachId: coachId,
        // On convertit le texte reçu en vraie Date
        date: new Date(dateString), 
        status: 'PENDING'
      }
    });
  }

  // Voir mes réservations (pour le patient)
  async getMyBookings(userId: string) {
    return await prisma.booking.findMany({
      where: { patientId: userId },
      include: { coach: { include: { professionalProfile: true } } } // On récupère les infos du coach
    });
  }
    // 1. Récupérer les RDV pour un COACH
    async getCoachBookings(coachId: string) {
      return await prisma.booking.findMany({
        where: { coachId: coachId },
        include: { patient: true }, // On veut savoir QUI a réservé (le nom du patient)
        orderBy: { date: 'desc' }
      });
    }
  
    // 2. Changer le statut (Accepter/Refuser)
    async updateStatus(bookingId: string, newStatus: string) {
      return await prisma.booking.update({
        where: { id: bookingId },
        data: { status: newStatus }
      });
    }
}