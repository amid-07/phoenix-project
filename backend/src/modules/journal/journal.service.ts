import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class JournalService {
  
  // Créer une entrée
  async createEntry(userId: string, content: string, mood: number) {
    return await prisma.journal.create({
      data: { userId, content, mood }
    });
  }

  // Historique complet (pour l'affichage)
  async getUserJournal(userId: string) {
    return await prisma.journal.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Entrées de la semaine (pour l'IA)
  async getWeeklyEntries(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await prisma.journal.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: sevenDaysAgo, // On prend seulement les 7 derniers jours
        },
      },
      orderBy: { createdAt: 'asc' }, 
    });
  }
}