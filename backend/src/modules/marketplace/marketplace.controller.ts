import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Lister les coachs
  @Get('coaches')
  async getCoaches() {
    return this.marketplaceService.getAllCoaches();
  }

  // Détails d'un coach
  @Get('coach/:id')
  async getDetails(@Param('id') id: string) {
    return this.marketplaceService.getCoachDetails(id);
  }

  // Poster un avis
  @Post('review')
  async postReview(@Body() body: any) {
    return this.marketplaceService.addReview(
      body.userId, 
      body.coachId, 
      body.rating, 
      body.comment
    );
  }

  // Ajouter un créneau (Coach)
  @Post('availability')
  async addSlot(@Body() body: any) {
    return this.marketplaceService.addAvailability(
      body.userId, 
      body.date, 
      body.type // REMOTE ou IN_PERSON
    );
  }

  // Voir mes créneaux (Coach)
  @Get('availability/:userId')
  async getMySlots(@Param('userId') userId: string) {
    return this.marketplaceService.getCoachAvailabilities(userId);
  }

  // Mettre à jour l'adresse (Coach)
  @Post('address')
  async updateAddress(@Body() body: any) {
    return this.marketplaceService.updateAddress(body.userId, body.address);
  }
}