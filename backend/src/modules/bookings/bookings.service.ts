import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BookingsService {
  
  // 1. Créer une réservation (et bloquer le créneau)
  async createBooking(patientId: string, coachId: string, dateString: string, availabilityId?: string) {
    console.log(`📅 Réservation demandée : Patient ${patientId} -> Coach ${coachId} le ${dateString}`);
    
    // ÉTAPE CLÉ : Si on fournit un ID de créneau, on le marque comme "Occupé"
    if (availabilityId) {
      await prisma.availability.update({
        where: { id: availabilityId },
        data: { isBooked: true } // Le créneau disparaîtra de la liste des dispos
      });
    }

    // Création du RDV
    return await prisma.booking.create({
      data: {
        patientId: patientId,
        coachId: coachId,
        date: new Date(dateString),
        status: 'PENDING'
      }
    });
  }

  // 2. Voir les réservations d'un PATIENT
  async getMyBookings(userId: string) {
    return await prisma.booking.findMany({
      where: { patientId: userId },
      include: { 
        coach: { include: { professionalProfile: true } } 
      },
      orderBy: { date: 'desc' }
    });
  }

  // 3. Voir les demandes pour un COACH
  async getCoachBookings(coachId: string) {
    return await prisma.booking.findMany({
      where: { coachId: coachId },
      include: { patient: true },
      orderBy: { date: 'desc' }
    });
  }

  // 4. Mettre à jour le statut (Accepter/Refuser)
  async updateStatus(bookingId: string, newStatus: string) {
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus }
    });
  }
}