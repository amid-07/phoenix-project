import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du remplissage de la base de données...');

  // -------------------------
  // 1. CRÉATION DES BADGES
  // -------------------------
  console.log('🏆 Création des badges...');
  
  const badges = [
    { name: 'Premier Pas', description: '24 heures de sobriété', requiredDays: 1, iconName: 'footsteps' },
    { name: 'Trois Jours', description: 'Le cap difficile est passé', requiredDays: 3, iconName: 'flame' },
    { name: 'Une Semaine', description: '7 jours de liberté', requiredDays: 7, iconName: 'trophy' },
    { name: 'Maître Zen', description: '30 jours : Une nouvelle vie', requiredDays: 30, iconName: 'diamond' },
    { name: 'Spartiate', description: '90 jours : La discipline absolue', requiredDays: 90, iconName: 'shield' },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.name },
      update: {},
      create: {
        id: badge.name,
        name: badge.name,
        description: badge.description,
        requiredDays: badge.requiredDays,
        iconName: badge.iconName
      }
    });
  }

  // -------------------------
  // 2. CRÉATION DES COACHS
  // -------------------------
  console.log('👨‍⚕️ Création des coachs...');

  const coachesData = [
    {
      email: 'sarah.psy@test.com',
      username: 'Dr. Sarah Connor',
      role: 'COACH',
      profile: {
        title: 'Psychologue TCC',
        bio: 'Spécialiste des addictions comportementales (Jeu, Internet). 10 ans d\'expérience en clinique.',
        hourlyRate: 60,
        specialties: ['Jeu', 'Ecran'],
        rating: 4.9
      }
    },
    {
      email: 'marc.coach@test.com',
      username: 'Marc Levi',
      role: 'COACH',
      profile: {
        title: 'Coach de vie & Sport',
        bio: 'Je vous aide à remplacer vos mauvaises habitudes par le sport et la discipline mentale.',
        hourlyRate: 45,
        specialties: ['Drogue', 'Tabac'],
        rating: 4.7
      }
    }
  ];

  for (const c of coachesData) {
    const existing = await prisma.user.findUnique({ where: { email: c.email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: c.email,
          password: 'pass', // Mot de passe simple pour le test
          username: c.username,
          // @ts-ignore (Si TypeScript râle sur l'enum, on ignore)
          role: 'COACH',
          professionalProfile: {
            create: c.profile
          }
        }
      });
    }
  }

  // -------------------------
  // 3. GÉNÉRATION DES CRÉNEAUX HORAIRES (DISPONIBILITÉS)
  // -------------------------
  console.log('📅 Génération des créneaux horaires...');

  // On récupère tous les profils de coachs existants
  const profiles = await prisma.professionalProfile.findMany();

  for (const profile of profiles) {
    // On efface les vieux créneaux pour éviter les doublons lors des tests
    await prisma.availability.deleteMany({ where: { profileId: profile.id } });

    // On génère des créneaux pour les 7 prochains jours
    for (let i = 1; i <= 7; i++) {
      const today = new Date();
      
      // Créneau de 10h00
      const date1 = new Date(today);
      date1.setDate(today.getDate() + i);
      date1.setHours(10, 0, 0, 0);

      // Créneau de 14h00
      const date2 = new Date(today);
      date2.setDate(today.getDate() + i);
      date2.setHours(14, 0, 0, 0);

      // Créneau de 16h00
      const date3 = new Date(today);
      date3.setDate(today.getDate() + i);
      date3.setHours(16, 0, 0, 0);

      const slots = [date1, date2, date3];

      for (const slotDate of slots) {
        await prisma.availability.create({
          data: {
            profileId: profile.id,
            date: slotDate,
            isBooked: false
          }
        });
      }
    }
  }

  console.log('✅ Base de données prête ! (Badges + Coachs + Créneaux)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });