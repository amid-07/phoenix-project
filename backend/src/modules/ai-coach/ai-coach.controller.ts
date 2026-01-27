import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AiCoachService } from './ai-coach.service';
// Import du service Journal pour récupérer les données de la base
import { JournalService } from '../journal/journal.service'; 

@Controller('ai-coach')
export class AiCoachController {
  
  constructor(
    private readonly aiCoachService: AiCoachService,
    private readonly journalService: JournalService // <--- Injection indispensable
  ) {}

  // --- 1. CHAT (Avec Mémoire) ---
  @Post('chat')
  async chat(@Body() body: any) {
    try {
      // On passe le message ET l'historique à l'IA
      const response = await this.aiCoachService.getAdvice(body.message, body.history);
      return { text: response };
    } catch (e) {
      console.error("Erreur Chat:", e);
      return { text: "Désolé, je rencontre un problème technique." }; 
    }
  }

  // --- 2. DÉFI DU JOUR ---
  @Get('challenge')
  async getChallenge() {
    try {
      const response = await this.aiCoachService.getDailyChallenge();
      return { text: response };
    } catch (e) {
      return { text: "Prends 5 minutes pour respirer profondément." }; 
    }
  }

  // --- 3. ANALYSE HEBDOMADAIRE ---
  @Get('analysis/:userId')
  async getWeeklyAnalysis(@Param('userId') userId: string) {
    console.log("🧠 Analyse demandée pour l'ID :", userId);
    
    try {
      // A. Récupérer les journaux des 7 derniers jours
      const entries = await this.journalService.getWeeklyEntries(userId);
      console.log(`📚 ${entries.length} entrées trouvées.`);

      // B. Générer l'analyse JSON avec l'IA
      const analysisJson = await this.aiCoachService.analyzeWeeklyJournal(entries);
      console.log("🤖 Analyse générée.");
      
      // On parse pour s'assurer que c'est bien du JSON avant d'envoyer
      // (Si l'IA renvoie du texte brut par erreur, le try/catch l'attrapera)
      return JSON.parse(analysisJson);

    } catch (error) {
      console.error("❌ Erreur Analyse :", error);
      // Fallback en cas d'erreur pour ne pas faire planter l'app
      return {
        score: 50,
        stressLevel: 50,
        motivation: 50,
        triggers: ["Données insuffisantes"],
        summary: "Impossible de générer le bilan pour le moment. Continuez à remplir votre journal."
      };
    }
  }
}