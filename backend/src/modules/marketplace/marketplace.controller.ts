import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // 1. Liste simple
  @Get('coaches')
  async getCoaches() {
    return this.marketplaceService.getAllCoaches();
  }

  // 2. Recherche avec filtres (ex: /marketplace/search?city=Paris&type=REMOTE)
  @Get('search')
  async search(@Query() query: any) {
    return this.marketplaceService.searchCoaches(query);
  }

  // 3. Détail complet d'un coach
  @Get('coach/:id')
  async getDetails(@Param('id') id: string) {
    return this.marketplaceService.getCoachDetails(id);
  }

  // 4. Modifier son profil coach
  @Patch('profile')
  async updateProfile(@Body() body: any) {
    return this.marketplaceService.updateCoachProfile(body.userId, body.data);
  }

  // 5. Poster un avis
  @Post('review')
  async postReview(@Body() body: any) {
    return this.marketplaceService.addReview(
      body.userId, 
      body.coachId, 
      body.rating, 
      body.comment
    );
  }

  // 6. Ajouter un créneau
  @Post('availability')
  async addSlot(@Body() body: any) {
    return this.marketplaceService.addAvailability(
      body.userId, 
      body.date, 
      body.type
    );
  }

  // 7. Voir ses créneaux
  @Get('availability/:userId')
  async getMySlots(@Param('userId') userId: string) {
    return this.marketplaceService.getCoachAvailabilities(userId);
  }

  // 8. Mettre à jour adresse (Legacy)
  @Post('address')
  async updateAddress(@Body() body: any) {
    return this.marketplaceService.updateAddress(body.userId, body.address);
  }
}