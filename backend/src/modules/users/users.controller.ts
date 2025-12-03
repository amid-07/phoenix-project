import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboarding')
  async createProfile(@Body() body: any) {
    return this.usersService.createUser(body);
  }
  @Post(':id/update-cost')
  async updateCost(@Param('id') id: string, @Body() body: any) {
    // On convertit bien le texte en nombre (parseFloat)
    return this.usersService.updateUserCost(id, parseFloat(body.dailyCost));
  }
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.usersService.loginUser(body);
    if (!user) {
      return { status: 'error', message: 'Email ou mot de passe incorrect' };
    }
    return user;
  }
  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id);
  }
  @Post(':id/relapse')
  async relapse(@Param('id') id: string) {
    return this.usersService.reportRelapse(id);
  }
}