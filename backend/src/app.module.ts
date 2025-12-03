import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


import { AiCoachController } from './modules/ai-coach/ai-coach.controller';
import { UsersController } from './modules/users/users.controller';
import { MarketplaceController } from './modules/marketplace/marketplace.controller';
import { BookingsController } from './modules/bookings/bookings.controller';
import { JournalController } from './modules/journal/journal.controller';


import { AiCoachService } from './modules/ai-coach/ai-coach.service';
import { UsersService } from './modules/users/users.service';
import { MarketplaceService } from './modules/marketplace/marketplace.service';
import { BookingsService } from './modules/bookings/bookings.service';
import { JournalService } from './modules/journal/journal.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [
    AiCoachController, 
    UsersController, 
    MarketplaceController, 
    BookingsController, 
    JournalController
  ],
  providers: [
    AiCoachService, 
    UsersService, 
    MarketplaceService, 
    BookingsService, 
    JournalService
  ],
})
export class AppModule {}