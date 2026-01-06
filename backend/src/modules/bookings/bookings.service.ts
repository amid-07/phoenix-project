import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BookingsService {
  
  // --- 1. CRÉER UNE RÉSERVATION ---
  async createBooking(patientId: string, coachId: string, dateString: string, availabilityId?: string) {
    console.log(`📅 Réservation : Patient ${patientId} -> Coach ${coachId}`);
    
    let sessionType = 'REMOTE'; // Par défaut, si pas de créneau lié

    // Si la réservation vient d'un créneau spécifique
    if (availabilityId) {
      // 1. On récupère le créneau pour connaître son TYPE (Visio ou Cabinet)
      const slot = await prisma.availability.findUnique({
        where: { id: availabilityId }
      });

      if (slot) {
        sessionType = slot.type; // On copie le type (ex: IN_PERSON)
      }

      // 2. On marque le créneau comme "Occupé"
      await prisma.availability.update({
        where: { id: availabilityId },
        data: { isBooked: true }
      });
    }

    // 3. On crée la réservation finale
    return await prisma.booking.create({
      data: {
        patientId: patientId,
        coachId: coachId,
        date: new Date(dateString),
        status: 'PENDING',
        type: sessionType as any // On sauvegarde le type (REMOTE/IN_PERSON)
      }
    });
  }

  // --- 2. MES RDV (Patient) ---
  async getMyBookings(userId: string) {
    return await prisma.booking.findMany({
      where: { patientId: userId },
      include: { 
        coach: { include: { professionalProfile: true } } // On a besoin du profil pour l'adresse
      },
      orderBy: { date: 'desc' }
    });
  }

  // --- 3. MES DEMANDES (Coach) ---
  async getCoachBookings(coachId: string) {
    return await prisma.booking.findMany({
      where: { coachId: coachId },
      include: { patient: true },
      orderBy: { date: 'desc' }
    });
  }

  // --- 4. CHANGER STATUT (Accepter/Refuser) ---
  async updateStatus(bookingId: string, newStatus: string) {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus }
    });
  }
}