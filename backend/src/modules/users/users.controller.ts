import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboarding')
  async createProfile(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    try {
      const user = await this.usersService.loginUser(body);
      if (!user) return { status: 'error', message: 'Identifiants incorrects' };
      return user;
    } catch (e) {
      // Renvoie l'erreur de validation (Compte non vérifié)
      return { status: 'error', message: e.message };
    }
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id);
  }

  @Post(':id/update-cost')
  async updateCost(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUserCost(id, parseFloat(body.dailyCost));
  }

  @Post(':id/relapse')
  async relapse(@Param('id') id: string) {
    return this.usersService.reportRelapse(id);
  }
}