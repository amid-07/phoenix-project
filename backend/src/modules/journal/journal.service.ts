import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class JournalService {
  
  // 1. Créer une nouvelle entrée
  async createEntry(userId: string, content: string, mood: number) {
    console.log(`📝 Nouveau journal pour ${userId} (Humeur: ${mood})`);
    
    return await prisma.journal.create({
      data: {
        userId: userId,
        content: content,
        mood: mood,
      }
    });
  }

  // 2. Récupérer tout l'historique d'un utilisateur
  async getUserJournal(userId: string) {
    return await prisma.journal.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 3. Récupérer les entrées de la SEMAINE (Pour l'IA)
  // ...

  // Récupérer les entrées (MODIFIÉ POUR LE TEST : PREND TOUT)
  async getWeeklyEntries(userId: string) {
    
    // const sevenDaysAgo = new Date();
    // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await prisma.journal.findMany({
      where: {
        userId: userId,
        // ON ENLÈVE LE FILTRE DE DATE POUR LE TEST
        // createdAt: {
        //   gte: sevenDaysAgo, 
        // },
      },
      orderBy: { createdAt: 'asc' }, 
    });
  }
}