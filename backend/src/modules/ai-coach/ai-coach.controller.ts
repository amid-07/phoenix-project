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
  async chat(@Body('message') message: string) {
    try {
      return { text: await this.aiCoachService.getAdvice(message) };
    } catch (e) { return { text: "Erreur" }; }
  }

  @Get('challenge')
  async getChallenge() {
    try {
      return { text: await this.aiCoachService.getDailyChallenge() };
    } catch (e) { return { text: "Erreur" }; }
  }

  // --- C'EST ICI QUE ÇA SE JOUE ---
  @Get('analysis/:userId')
  async getWeeklyAnalysis(@Param('userId') userId: string) {
    console.log("🧠 Analyse structurée demandée pour :", userId);
    
    try {
      const entries = await this.journalService.getWeeklyEntries(userId);
      const rawJson = await this.aiCoachService.analyzeWeeklyJournal(entries);
      
      // On parse le texte de l'IA pour en faire un vrai objet JavaScript
      const analysisData = JSON.parse(rawJson);
      
      return analysisData; // On renvoie directement l'objet JSON

    } catch (error) {
      console.error("❌ Erreur Analyse :", error);
      // En cas d'erreur, on renvoie des données par défaut
      return {
        score: 50,
        stressLevel: 50,
        motivation: 50,
        triggers: ["Analyse impossible"],
        summary: "Veuillez réessayer plus tard."
      };
    }
  }
}