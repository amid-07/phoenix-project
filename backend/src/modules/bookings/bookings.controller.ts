import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Créer un RDV
  @Post()
  async create(@Body() body: any) {
    return this.bookingsService.createBooking(
      body.patientId, 
      body.coachId, 
      body.date,
      body.availabilityId // Important pour bloquer le créneau
    );
  }

  // Liste pour le Patient
  @Get('patient/:id')
  async getMy(@Param('id') id: string) {
    return this.bookingsService.getMyBookings(id);
  }

  // Liste pour le Coach
  @Get('coach/:id')
  async getForCoach(@Param('id') id: string) {
    return this.bookingsService.getCoachBookings(id);
  }

  // Changer statut (Accepter/Refuser)
  @Post(':id/status')
  async changeStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateStatus(id, status);
  }

  // Scanner un QR Code
  @Post('scan')
  async scanTicket(@Body() body: any) {
    try {
      return await this.bookingsService.validateSession(body.bookingId, body.coachId);
    } catch (e) {
      // On renvoie un objet erreur pour que l'app mobile puisse l'afficher
      return { error: e.message }; 
    }
  }
}