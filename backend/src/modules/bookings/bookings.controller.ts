import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() body: any) {
    // On passe la date reçue du téléphone
    return this.bookingsService.createBooking(body.patientId, body.coachId, body.date);
  }

  @Get('patient/:id')
  async getMy(@Param('id') id: string) {
    return this.bookingsService.getMyBookings(id);
  }
  @Get('coach/:id')
  async getForCoach(@Param('id') id: string) {
    return this.bookingsService.getCoachBookings(id);
  }
  @Post(':id/status')
  async changeStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateStatus(id, status);
  }
}