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
    // Upsert permet de créer si ça n'existe pas, ou de ne rien faire si ça existe déjà
    await prisma.badge.upsert({
      where: { id: badge.name }, // On utilise le nom comme ID unique pour le seed
      update: {}, // Si trouvé, on ne change rien
      create: {
        id: badge.name, // On force l'ID
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

  // Coach 1 : Dr. Sarah
  const emailSarah = 'sarah.psy@test.com';
  const existingSarah = await prisma.user.findUnique({ where: { email: emailSarah } });

  if (!existingSarah) {
    await prisma.user.create({
      data: {
        email: emailSarah,
        password: 'pass',
        username: 'Dr. Sarah Connor',
        role: 'COACH',
        professionalProfile: {
          create: {
            title: 'Psychologue TCC',
            bio: 'Spécialiste des addictions comportementales (Jeu, Internet). 10 ans d\'expérience en clinique.',
            hourlyRate: 60,
            specialties: ['Jeu', 'Ecran'],
            rating: 4.9
          }
        }
      }
    });
  }

  // Coach 2 : Marc
  const emailMarc = 'marc.coach@test.com';
  const existingMarc = await prisma.user.findUnique({ where: { email: emailMarc } });

  if (!existingMarc) {
    await prisma.user.create({
      data: {
        email: emailMarc,
        password: 'pass',
        username: 'Marc Levi',
        role: 'COACH',
        professionalProfile: {
          create: {
            title: 'Coach de vie & Sport',
            bio: 'Je vous aide à remplacer vos mauvaises habitudes par le sport et la discipline mentale.',
            hourlyRate: 45,
            specialties: ['Drogue', 'Tabac'],
            rating: 4.7
          }
        }
      }
    });
  }

  console.log('✅ Base de données initialisée avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });