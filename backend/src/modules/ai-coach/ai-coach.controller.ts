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
  async chat(@Body() body: { message: string, history: any[] }) {
    try {
      // On extrait le message et l'historique envoyés par le frontend
      const { message, history } = body;
      
      const reply = await this.aiCoachService.getAdvice(message, history || []);
      
      return { text: reply };
    } catch (e) {
      console.error("Erreur Controller Chat:", e);
      return { text: "Désolé khoya/khti, chwiya dyal l3ya. Peux-tu répéter ?" };
    }
  }

  @Get('challenge')
  async getChallenge() {
    try {
      return { text: await this.aiCoachService.getDailyChallenge() };
    } catch (e) { return { text: "Prends un grand verre d'eau et respire." }; }
  }

  @Get('analysis/:userId')
  async getWeeklyAnalysis(@Param('userId') userId: string) {
    try {
      const entries = await this.journalService.getWeeklyEntries(userId);
      const rawJson = await this.aiCoachService.analyzeWeeklyJournal(entries);
      return JSON.parse(rawJson);
    } catch (error) {
      return {
        score: 50,
        stressLevel: 50,
        motivation: 50,
        triggers: ["Erreur d'analyse"],
        summary: "Réessaie plus tard."
      };
    }
  }
}