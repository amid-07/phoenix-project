import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class MarketplaceService {
  async getAllCoaches() {
    // On cherche tous les utilisateurs qui ont le rôle COACH
    // Et on inclut leur profil professionnel
    return await prisma.user.findMany({
      where: { role: 'COACH' },
      include: { professionalProfile: true },
    });
  }
}