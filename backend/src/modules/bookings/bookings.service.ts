import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class BookingsService {
  
  // --- 1. CRÉER UNE RÉSERVATION ---
  async createBooking(patientId: string, coachId: string, dateString: string, availabilityId?: string) {
    console.log(`📅 Réservation demandée : Patient ${patientId} -> Coach ${coachId}`);
    
    let sessionType = 'REMOTE'; // Par défaut

    // Si la réservation vient d'un créneau spécifique du calendrier
    if (availabilityId) {
      // On récupère le créneau pour connaître son TYPE (Visio ou Cabinet)
      const slot = await prisma.availability.findUnique({
        where: { id: availabilityId }
      });

      if (slot) {
        sessionType = slot.type; // On copie le type (ex: IN_PERSON)
      }

      // On marque le créneau comme "Occupé" pour qu'il disparaisse du calendrier
      await prisma.availability.update({
        where: { id: availabilityId },
        data: { isBooked: true }
      });
    }

    // Création du RDV
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

  // --- 2. VOIR MES RDV (Patient) ---
  async getMyBookings(userId: string) {
    return await prisma.booking.findMany({
      where: { patientId: userId },
      include: { 
        coach: { include: { professionalProfile: true } } // Pour avoir l'adresse du cabinet
      },
      orderBy: { date: 'desc' }
    });
  }

  // --- 3. VOIR MES DEMANDES (Coach) ---
  async getCoachBookings(coachId: string) {
    return await prisma.booking.findMany({
      where: { coachId: coachId },
      include: { patient: true }, // Pour avoir le nom du patient
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

  // --- 5. VALIDATION PAR SCAN QR CODE (Séance Terminée) ---
  async validateSession(bookingId: string, coachId: string) {
    // A. On cherche le RDV
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) throw new Error("Réservation introuvable ou code invalide.");
    
    // B. Vérification de sécurité : Est-ce bien le coach de ce RDV ?
    if (booking.coachId !== coachId) throw new Error("Ce n'est pas votre client !");
    
    // C. Vérification état : Déjà validé ?
    if (booking.status === 'COMPLETED') throw new Error("Cette séance a déjà été validée.");

    console.log(`✅ Séance validée via Scan : ${bookingId}`);

    // D. On passe le statut à COMPLETED (L'argent est acquis)
    return await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' }
    });
  }
}