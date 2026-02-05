import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AiCoachService } from './ai-coach.service';
import { JournalService } from '../journal/journal.service';

@Controller('ai-coach')
export class AiCoachController {
  
  constructor(
    private readonly aiCoachService: AiCoachService,
    private readonly journalService: JournalService
  ) {}

  @Post('chat')
  async chat(@Body() body: { message: string, history?: any[] }) {
    try {
      // On passe le message et l'historique (si présent) pour la mémoire de TAFSUT
      const response = await this.aiCoachService.getAdvice(body.message, body.history || []);
      return { text: response };
    } catch (e) { 
      console.error("Erreur Chat:", e);
      return { text: "Désolé, j'ai un petit bug. On peut reprendre ?" }; 
    }
  }

  @Get('challenge')
  async getChallenge() {
    try {
      return { text: await this.aiCoachService.getDailyChallenge() };
    } catch (e) { 
      return { text: "Prends 5 minutes pour respirer profondément aujourd'hui." }; 
    }
  }

  @Get('analysis/:userId')
  async getWeeklyAnalysis(@Param('userId') userId: string) {
    console.log("🧠 Analyse structurée demandée pour :", userId);
    
    try {
      const entries = await this.journalService.getWeeklyEntries(userId);
      const rawJson = await this.aiCoachService.analyzeWeeklyJournal(entries);
      
      // On parse le texte de l'IA pour en faire un vrai objet JavaScript
      const analysisData = JSON.parse(rawJson);
      return analysisData;

    } catch (error) {
      console.error("❌ Erreur Analyse :", error);
      return {
        score: 50,
        stressLevel: 50,
        motivation: 50,
        triggers: ["Analyse indisponible"],
        summary: "Continue d'écrire, je ferai le point avec toi très bientôt."
      };
    }
  }
}