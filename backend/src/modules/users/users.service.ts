import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  
  // --- 1. INSCRIPTION ---
  async createUser(data: any) {
    console.log("📝 Inscription :", data.email);

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

    // Gestion Anonymat
    let finalUsername = data.username;
    if (data.isAnonymous) {
      finalUsername = `Warrior_${Math.floor(Math.random() * 10000)}`;
    }

    const role = data.role === 'COACH' ? 'COACH' : 'USER';
    // Les coachs doivent être vérifiés manuellement (False), les patients entrent direct (True)
    const isVerified = role === 'USER'; 

    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        username: finalUsername,
        role: role,
        isVerified: isVerified,
        
        addictionType: 'SMOKING',
        dailyCost: data.dailyCost ? parseFloat(data.dailyCost) : null,
        startDate: new Date(),
        moneySaved: 0,
        currentStreak: 0,

        professionalProfile: role === 'COACH' ? {
          create: {
            title: "Nouveau Coach",
            bio: "Biographie à compléter...",
            hourlyRate: 50,
            specialties: []
          }
        } : undefined
      },
    });
  }

  // --- 2. LOGIN ---
  async loginUser(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || user.password !== data.password) return null;

    // Blocage si Coach non vérifié
    if (user.role === 'COACH' && !user.isVerified) {
      throw new Error("Votre compte est en attente de validation.");
    }

    return user;
  }

  // --- 3. AUTRES FONCTIONS (Stats, Rechute...) ---
  async updateUserCost(userId: string, cost: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: { dailyCost: cost, startDate: new Date() },
    });
  }

  async reportRelapse(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { startDate: new Date(), currentStreak: 0 },
    });
  }

  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { professionalProfile: true } 
    });
    
    if (!user) return { days: 0, money: 0, badges: [] };

    if (user.role === 'COACH') {
      const reservationsCount = await prisma.booking.count({ where: { coachId: userId } });
      const paidBookings = await prisma.booking.count({
        where: { coachId: userId, OR: [{ status: 'COMPLETED' }, { status: 'CONFIRMED', type: 'REMOTE' }] }
      });
      const hourlyRate = user.professionalProfile?.hourlyRate || 0;
      
      return {
        role: 'COACH',
        username: user.username,
        reservationsCount,
        earnings: paidBookings * hourlyRate,
        hourlyRate
      };
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - user.startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    const money = diffDays * (user.dailyCost || 0);

    await this.checkAndAwardBadges(userId, diffDays);
    const unlockedBadges = await prisma.userBadge.findMany({
      where: { userId: userId }, include: { badge: true }
    });

    return {
      role: 'USER',
      days: diffDays,
      money: Math.floor(money),
      username: user.username,
      badges: unlockedBadges.map(ub => ub.badge)
    };
  }

  private async checkAndAwardBadges(userId: string, currentDays: number) {
    const allBadges = await prisma.badge.findMany();
    for (const badge of allBadges) {
      if (currentDays >= badge.requiredDays) {
        const alreadyHas = await prisma.userBadge.findFirst({ where: { userId: userId, badgeId: badge.id } });
        if (!alreadyHas) {
          await prisma.userBadge.create({ data: { userId: userId, badgeId: badge.id } });
        }
      }
    }
  }
}