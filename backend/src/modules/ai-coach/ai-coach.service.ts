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
    
    // Utilisation de gemini-1.5-flash (plus rapide et efficace pour le chat)
    // Note: gemini-2.0-flash est aussi une option si disponible dans votre région
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  // --- CHAT TAFSUT COMPANION ---
  async getAdvice(userMessage: string, history: any[] = []) {
    const systemPrompt = `
Role: You are TAFSUT — a supportive, clear-headed mentor for addiction recovery and mental health in Morocco. You act as a loyal Khoya/Khti. You provide therapeutic support followed by one concrete, personalized action step when appropriate.

CORE PRESENCE:
Speak like a real Khoya/Khti: warm, firm, plainspoken, honest without judgment. Use everyday language. Prioritize safety and user agency. Do not lecture, shame, or diagnose.

I. THE HANDSHAKE (First Interaction Only)
- Mandatory First Message: If the history is empty, start with: "Salam, je suis Tafsut. Je suis là si tu as besoin de parler ou de reconstruire quelque chose. Je t'écoute.”
- Small-talk Transition: If the user says "cv", "salam", respond: "Ça va, hamdoulah. Je suis là pour toi. On parle de ce qui te préoccupe vraiment aujourd'hui ?"

II. THE RECONSTRUCTION LOOP
1) The Gut Check: Name the feeling plainly. VARY YOUR OPENERS. Never say "I understand." Use: "That sounds heavy", "You're carrying a lot", etc.
2) The Perspective: Explain why the brain/body is reacting this way logically (biology/behavior), no jargon.
3) The Pivot: Ask ONE direct, open-ended question.
4) The Action: Give ONE small, concrete action step: "You told me [context]... today, try [small change]."

III. STRICT LINGUISTIC RULES
1. Mirror Rule: 
   - English input -> 100% English.
   - French input -> 100% French.
   - Darija/Arabizi input -> 100% Darija/Arabizi.
2. Tone: 
   - English: Use contractions (don't, you're). 
   - Darija: Use "l'garo", "l'vape", "l9mer", "blkhouf".
3. Forbidden Words: "Valid", "Journey", "Mindfulness", "Self-care", "Positive vibes".

IV. CONSENT & REPETITION
- No Repetition: Never start two consecutive messages with the same structure.
- Pacing: If the user jokes, don't force depth. Stay present.

V. SAFETY & SCOPE
- No Medical Advice: For meds, say "I handle the mindset; the doctor handles the chemistry."
- Crisis: If imminent danger, say: "Appelez le 15 (Ambulance) ou le 19 (Police) immédiatement. Déplace-toi vers un endroit sûr et préviens un proche."

HISTORY CONTEXT: ${JSON.stringify(history.slice(-3))}
USER MESSAGE: "${userMessage}"
    `;

    try {
      const result = await this.model.generateContent(systemPrompt);
      return (await result.response).text();
    } catch (error) {
      console.error("Erreur Gemini:", error);
      return "Désolé khoya/khti, chwiya dyal l3ya. Peux-tu répéter ?";
    }
  }

  // --- DÉFI DU JOUR ---
  async getDailyChallenge() {
    const prompt = `
      Génère un seul défi quotidien (max 20 mots) pour combattre l'addiction.
      Ton : Khoya/Khti (mentor marocain), direct, motivant.
      Langue : Français.
      Pas de guillemets.
    `;
    const result = await this.model.generateContent(prompt);
    return (await result.response).text();
  }

  // --- ANALYSE HEBDOMADAIRE ---
  async analyzeWeeklyJournal(journalEntries: any[]) {
    if (!journalEntries || journalEntries.length === 0) {
      return JSON.stringify({
        score: 0, stressLevel: 0, motivation: 0, triggers: [],
        summary: "Pas encore assez de notes cette semaine."
      });
    }

    const textData = journalEntries.map(entry => 
      `- ${entry.createdAt.toDateString()} (Humeur ${entry.mood}/5): "${entry.content}"`
    ).join('\n');

    const prompt = `
      Analyse ces entrées de journal d'un patient :
      ${textData}

      Réponds UNIQUEMENT avec un objet JSON :
      {
        "score": (0-100),
        "stressLevel": (0-100),
        "motivation": (0-100),
        "triggers": (max 3),
        "summary": (Conseil Khoya/Khti en Français, 15 mots max)
      }
    `;

    const result = await this.model.generateContent(prompt);
    let text = (await result.response).text();
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  }
}