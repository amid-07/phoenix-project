import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Route: GET /marketplace/coaches
  @Get('coaches')
  async getCoaches() {
    return this.marketplaceService.getAllCoaches();
  }

  // Route: GET /marketplace/coach/:id (Détails complets)
  @Get('coach/:id')
  async getDetails(@Param('id') id: string) {
    return this.marketplaceService.getCoachDetails(id);
  }

  // Route: POST /marketplace/review (Poster un avis)
  @Post('review')
  async postReview(@Body() body: any) {
    return this.marketplaceService.addReview(
      body.userId, 
      body.coachId, 
      body.rating, 
      body.comment
    );
  }
}