import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiCoachService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    
    if (!apiKey) {
      console.error("❌ ERREUR : La clé GEMINI_API_KEY est manquante dans l'environnement.");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // UTILISATION DE 'gemini-1.5-flash' (Le plus stable et performant pour le Darija/FR)
    // Note : C'est ce nom qui corrigera l'erreur 404 que tu voyais sur AI Studio
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: `
        Role: You are TAFSUT — a supportive, clear-headed mentor for addiction recovery in Morocco. You act as a loyal Khoya/Khti. 
        
        CORE PRESENCE:
        Speak like a real Khoya/Khti: warm, firm, honest. No judgment. Use everyday language. Do not lecture or diagnose.

        I. THE RECONSTRUCTION LOOP (The Main Flow)
        1) The Gut Check: Name the feeling plainly. VARY YOUR OPENERS (e.g., "That sounds heavy," "The stress is loud right now"). Never say "I understand."
        2) The Perspective: Explain why the brain is doing this logically (biology/behavior), no jargon.
        3) The Pivot: Ask ONE direct, open-ended question.
        4) The Action: Give ONE small, concrete action step when the user is ready.

        II. STRICT LINGUISTIC RULES
        - The Mirror Rule: Reply in the language the user speaks (Darija/Arabizi, French, or English).
        - English: Use contractions (don't, you're). No flowery language.
        - Darija: Use "l'garo", "l'vape", "l9mer", "blkhouf". 
        - Forbidden Words: "Valid", "Journey", "Mindfulness", "Self-care", "Positive vibes".

        III. SAFETY & SCOPE
        - No Medical Advice: For meds, say: "I handle the mindset; the doctor handles the chemistry."
        - Crisis Protocol: If imminent self-harm/danger, STOP the persona and say: "Appelez le 15 (Ambulance) ou le 19 (Police) immédiatement. Déplace-toi vers un endroit sûr et préviens un proche."
      `
    });
  }

  // --- MÉTHODE PRINCIPALE : CHAT AVEC COHÉRENCE ---
  async getAdvice(userMessage: string, history: any[] = []) {
    try {
      // 1. On formate l'historique reçu du frontend pour le SDK Gemini
      // Gemini attend : { role: 'user' | 'model', parts: [{ text: string }] }
      const formattedHistory = (history || []).map(m => ({
        role: (m.sender === 'ai' || m.sender === 'model') ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      // 2. Initialisation du chat avec l'historique pour la mémoire
      const chat = this.model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.8,
        },
      });

      // 3. Envoi du nouveau message
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      
      return response.text();

    } catch (error) {
      // Log détaillé pour voir l'erreur sur ton terminal VS Code ou Vercel Logs
      console.error("--- ERREUR GEMINI SERVICE ---");
      console.error(error);
      
      return "Désolé khoya/khti, chwiya dyal l3ya technique. On peut reparler dans un instant ?";
    }
  }

  // --- GÉNÉRATION DU DÉFI QUOTIDIEN ---
  async getDailyChallenge() {
    try {
      const prompt = "Génère un défi quotidien addiction (15 mots max, ton Khoya, Français).";
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      return "Prends 5 minutes de calme sans écran aujourd'hui.";
    }
  }

  // --- ANALYSE HEBDOMADAIRE ---
  async analyzeWeeklyJournal(journalEntries: any[]) {
    if (!journalEntries || journalEntries.length === 0) {
      return JSON.stringify({ 
        score: 0, stressLevel: 0, motivation: 0, triggers: [], 
        summary: "Pas assez de données pour l'analyse." 
      });
    }

    const textData = journalEntries.map(e => `- ${e.content}`).join('\n');
    const prompt = `Analyse en JSON: {score(0-100), stressLevel, motivation, triggers[], summary(15 mots max)}. Data: ${textData}`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      return text.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (e) {
      return JSON.stringify({ summary: "Erreur d'analyse." });
    }
  }
}