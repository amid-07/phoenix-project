import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Initialisation de la base de données
const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  
  // ----------------------------------------------------
  // 1. INSCRIPTION (ou Mise à jour si l'email existe)
  // ----------------------------------------------------
  async createUser(data: any) {
    console.log("📝 Tentative d'inscription pour :", data.email);

    let existingUser = null;
    
    // Vérification si l'utilisateur existe déjà
    if (data.email) {
      existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    }

    if (existingUser) {
      console.log("-> L'utilisateur existe déjà.");
      
      // Cas particulier : Le Quiz envoie parfois une mise à jour du coût
      if (data.dailyCost) {
        console.log("-> Mise à jour du coût journalier...");
        return await prisma.user.update({
          where: { id: existingUser.id },
          data: { dailyCost: parseFloat(data.dailyCost) },
        });
      }
      
      // Sinon, on retourne simplement l'utilisateur existant
      return existingUser;
    }

    // Création d'un nouvel utilisateur
    console.log("-> Création d'un nouveau profil...");
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // À crypter dans une vraie prod (bcrypt)
        username: data.username,
        addictionType: 'SMOKING', // Valeur par défaut
        dailyCost: parseFloat(data.dailyCost) || 0,
        startDate: new Date(),
        moneySaved: 0,
        currentStreak: 0,
      },
    });
  }

  // ----------------------------------------------------
  // 2. MISE À JOUR DU COÛT (Après le Quiz)
  // ----------------------------------------------------
  async updateUserCost(userId: string, cost: number) {
    console.log(`🔄 Mise à jour du coût pour ID ${userId} -> ${cost}€`);
    return await prisma.user.update({
      where: { id: userId },
      data: { 
        dailyCost: cost,
        // On réinitialise la date de début au moment du quiz pour un départ frais
        startDate: new Date() 
      },
    });
  }

  // ----------------------------------------------------
  // 3. LOGIN (Connexion classique)
  // ----------------------------------------------------
  async loginUser(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Vérification simple du mot de passe
    if (!user || user.password !== data.password) {
      return null;
    }
    return user;
  }

  // ----------------------------------------------------
  // 4. SIGNALER UNE RECHUTE (Remise à zéro)
  // ----------------------------------------------------
  async reportRelapse(userId: string) {
    console.log(`⚠️ Rechute signalée pour l'utilisateur ${userId}`);
    
    return await prisma.user.update({
      where: { id: userId },
      data: { 
        startDate: new Date(), // On remet le compteur à "Maintenant"
        currentStreak: 0       // Le streak retombe à 0
      },
    });
  }

  // ----------------------------------------------------
  // 5. RÉCUPÉRATION DES STATS & BADGES (Le cœur du Dashboard)
  // ----------------------------------------------------
  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return { days: 0, money: 0, badges: [] };
    }

    // A. Calcul des jours sobres
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - user.startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

    // B. Calcul de l'argent économisé
    const money = diffDays * (user.dailyCost || 0);

    // C. Vérification et attribution automatique des badges
    await this.checkAndAwardBadges(userId, diffDays);

    // D. Récupération des badges débloqués pour l'affichage
    const unlockedBadges = await prisma.userBadge.findMany({
      where: { userId: userId },
      include: { badge: true }
    });

    return {
      days: diffDays,
      money: Math.floor(money),
      username: user.username,
      role: user.role,
      badges: unlockedBadges.map(ub => ub.badge)
    };
  }

  // --- Fonction Privée : Moteur de Gamification ---
  private async checkAndAwardBadges(userId: string, currentDays: number) {
    // 1. On récupère tous les badges possibles
    const allBadges = await prisma.badge.findMany();

    for (const badge of allBadges) {
      // 2. Si l'utilisateur a atteint l'objectif du badge
      if (currentDays >= badge.requiredDays) {
        
        // 3. On vérifie s'il ne l'a pas déjà reçu
        const alreadyHas = await prisma.userBadge.findFirst({
          where: { userId: userId, badgeId: badge.id }
        });

        // 4. Si non, on lui donne !
        if (!alreadyHas) {
          console.log(`🎉 Nouveau badge débloqué pour ${userId}: ${badge.name}`);
          await prisma.userBadge.create({
            data: {
              userId: userId,
              badgeId: badge.id
            }
          });
        }
      }
    }
  }
}