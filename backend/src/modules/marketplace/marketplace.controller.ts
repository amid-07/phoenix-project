import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // 1. Tous les coachs
  @Get('coaches')
  async getCoaches() {
    return this.marketplaceService.getAllCoaches();
  }

  // 2. Détail d'un coach (avec créneaux patient)
  @Get('coach/:id')
  async getDetails(@Param('id') id: string) {
    return this.marketplaceService.getCoachDetails(id);
  }

  // 3. Poster un avis
  @Post('review')
  async postReview(@Body() body: any) {
    return this.marketplaceService.addReview(
      body.userId, 
      body.coachId, 
      body.rating, 
      body.comment
    );
  }

  // 4. Ajouter un créneau (Coach)
  @Post('availability')
  async addSlot(@Body() body: any) {
    return this.marketplaceService.addAvailability(body.userId, body.date);
  }

  // 5. Voir mes créneaux libres (Coach)
  @Get('availability/:userId')
  async getMySlots(@Param('userId') userId: string) {
    return this.marketplaceService.getCoachAvailabilities(userId);
  }
}