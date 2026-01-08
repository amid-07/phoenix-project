import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  
  // --- 1. INSCRIPTION ---
  async createUser(data: any) {
    console.log("📝 Inscription/Maj pour :", data.email);

    let existingUser = null;
    if (data.email) {
      existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    }

    if (existingUser) {
      if (data.dailyCost) {
        return await prisma.user.update({
          where: { id: existingUser.id },
          data: { dailyCost: parseFloat(data.dailyCost) },
        });
      }
      return existingUser;
    }

    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        username: data.username,
        role: data.role || 'USER', // Permet de créer des coachs si besoin via l'API, sinon USER par défaut
        addictionType: 'SMOKING',
        dailyCost: parseFloat(data.dailyCost) || 0,
        startDate: new Date(),
        moneySaved: 0,
        currentStreak: 0,
      },
    });
  }

  // --- 2. MISE À JOUR COÛT ---
  async updateUserCost(userId: string, cost: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: { dailyCost: cost, startDate: new Date() },
    });
  }

  // --- 3. LOGIN ---
  async loginUser(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || user.password !== data.password) return null;
    return user;
  }

  // --- 4. RECHUTE ---
  async reportRelapse(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { startDate: new Date(), currentStreak: 0 },
    });
  }

  // --- 5. CALCUL DES STATS (Cœur du Dashboard) ---
  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { professionalProfile: true } // On inclut le profil pro si c'est un coach
    });
    
    if (!user) return { days: 0, money: 0, badges: [] };

    // ========================
    // CAS A : C'EST UN COACH
    // ========================
    if (user.role === 'COACH') {
      // 1. Nombre total de demandes reçues
      const reservationsCount = await prisma.booking.count({
        where: { coachId: userId }
      });

      // 2. Nombre de séances TERMINÉES (Validées par QR ou manuellement)
      const completedBookings = await prisma.booking.count({
        where: { coachId: userId, status: 'COMPLETED' }
      });

      // 3. Calcul des gains : Séances terminées * Tarif Horaire
      const hourlyRate = user.professionalProfile?.hourlyRate || 0;
      const totalEarnings = completedBookings * hourlyRate;

      return {
        role: 'COACH',
        username: user.username,
        reservationsCount: reservationsCount,
        earnings: totalEarnings, // L'argent réel gagné
        hourlyRate: hourlyRate
      };
    }

    // ========================
    // CAS B : C'EST UN PATIENT
    // ========================
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - user.startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    const money = diffDays * (user.dailyCost || 0);

    // Vérification des badges
    await this.checkAndAwardBadges(userId, diffDays);
    const unlockedBadges = await prisma.userBadge.findMany({
      where: { userId: userId },
      include: { badge: true }
    });

    return {
      role: 'USER',
      days: diffDays,
      money: Math.floor(money),
      username: user.username,
      badges: unlockedBadges.map(ub => ub.badge)
    };
  }

  // --- Fonction Privée Badges ---
  private async checkAndAwardBadges(userId: string, currentDays: number) {
    const allBadges = await prisma.badge.findMany();
    for (const badge of allBadges) {
      if (currentDays >= badge.requiredDays) {
        const alreadyHas = await prisma.userBadge.findFirst({
          where: { userId: userId, badgeId: badge.id }
        });
        if (!alreadyHas) {
          await prisma.userBadge.create({ data: { userId: userId, badgeId: badge.id } });
        }
      }
    }
  }
}