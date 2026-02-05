import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiCoachService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // On définit l'identité de Tafsut ici (System Instruction)
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: `
        Role: You are TAFSUT — a supportive, clear-headed mentor for addiction recovery in Morocco. You act as a loyal Khoya/Khti.
        Tone: Warm, firm, plainspoken, honest. Use everyday language.
        Linguistic Rules: 
        - Mirror the user's language (Darija/French/English). 
        - If they use Arabizi (Latin script for Darija), reply in Arabizi.
        - Use local terms: "l'garo", "l'vape", "l9mer".
        - Never say "I understand" or "Valid".
        Structure: 
        1. Gut Check (plainly name the struggle).
        2. Perspective (explain brain biology/behavior without jargon).
        3. Pivot (ask one question).
        4. Action (one concrete step).
        Crisis: If imminent danger, tell them to call 15 or 19.
      `
    });
  }

  async getAdvice(message: string, history: any[]) {
    try {
      // Correction ici : On s'assure que le rôle est exactement ce que Gemini attend
      const formattedHistory = history.map(m => ({
        // Si le frontend envoie 'model' ou 'ai', on met 'model', sinon 'user'
        role: (m.sender === 'model' || m.sender === 'ai') ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));
  
      console.log("DEBUG HISTORY:", JSON.stringify(formattedHistory)); // Pour vérifier dans tes logs
  
      const chat = this.model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });
  
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
  
    } catch (error) {
      // Affiche l'erreur réelle dans ton terminal VS Code pour débugger
      console.error("ERREUR RÉELLE GEMINI:", error); 
      return "Désolé khoya/khti, j'ai un petit souci technique. On peut reparler dans un instant ?";
    }
  }

  // --- DÉFI DU JOUR ---
  async getDailyChallenge() {
    const prompt = "Génère un seul défi quotidien (max 20 mots) pour combattre l'addiction. Ton : Khoya/Khti marocain. Langue : Français.";
    const result = await this.model.generateContent(prompt);
    return (await result.response).text();
  }

  // --- ANALYSE HEBDOMADAIRE ---
  async analyzeWeeklyJournal(journalEntries: any[]) {
    if (!journalEntries || journalEntries.length === 0) {
      return JSON.stringify({ score: 0, stressLevel: 0, motivation: 0, triggers: [], summary: "Pas de données." });
    }
    const textData = journalEntries.map(e => `- ${e.content}`).join('\n');
    const prompt = `Analyse ces entrées et réponds en JSON brut: {score, stressLevel, motivation, triggers[], summary}. Données: ${textData}`;
    const result = await this.model.generateContent(prompt);
    return (await result.response).text().replace(/```json/g, '').replace(/```/g, '').trim();
  }
}