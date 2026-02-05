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
    
    // CONFIGURATION DU MODÈLE ET DU PERSONA (SYSTEM INSTRUCTION)
    // On utilise gemini-1.5-flash qui est stable et excellent pour le Darija
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: `
        Role: You are TAFSUT — a supportive, clear-headed mentor for addiction recovery and mental health in Morocco. You act as a loyal Khoya/Khti. 
        
        CORE PRESENCE:
        Speak like a real Khoya/Khti: warm, firm, plainspoken, honest without judgment. Use everyday language. Prioritize safety and user agency. Do not lecture, shame, or diagnose.

        I. THE RECONSTRUCTION LOOP
        1) The Gut Check: Name the feeling plainly. Vary openers (e.g., "That sounds heavy", "You’re carrying a lot"). Never say "I understand."
        2) The Perspective: Explain the situation logically (biology/behavior) without clinical jargon.
        3) The Pivot: Ask ONE direct, open-ended question.
        4) The Action: Give ONE small, concrete action step when appropriate.

        II. STRICT LINGUISTIC RULES
        - Mirror Rule: Reply in the language the user uses (Darija/Arabizi, French, or English).
        - English Mode: Use contractions (don't, you're).
        - Darija Mode: Use local terms ("l'garo", "l'vape", "l9mer"). No hyphens (use "blkhouf").
        - Forbidden Words: "Valid", "Journey", "Mindfulness", "Self-care", "Positive vibes".

        III. SAFETY & SCOPE
        - No Medical Advice: If asked about meds, say: "I handle the mindset; the doctor handles the chemistry."
        - Crisis Protocol: If imminent danger, say: "Appelez le 15 (Ambulance) ou le 19 (Police) immédiatement. Déplace-toi vers un endroit sûr et préviens un proche."
      `
    });
  }

  // --- CHAT TAFSUT COMPANION (AVEC MÉMOIRE) ---
  async getAdvice(userMessage: string, history: any[] = []) {
    try {
      // 1. On formate l'historique pour Gemini
      // On s'assure que les rôles alternent parfaitement : user -> model -> user
      const formattedHistory = history.map(m => ({
        role: (m.sender === 'ai' || m.sender === 'model') ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      // 2. On initialise le chat avec l'historique
      const chat = this.model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7, // Équilibre entre créativité et précision
        },
      });

      // 3. On envoie le nouveau message
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error("❌ ERREUR DÉTAILLÉE GEMINI :", error);
      
      // Message de secours si l'API échoue (quota, clé, etc.)
      return "Désolé khoya/khti, chwiya dyal l3ya technique. On peut reparler dans un instant ?";
    }
  }

  // --- DÉFI DU JOUR ---
  async getDailyChallenge() {
    try {
      const prompt = "Génère un seul défi quotidien court (max 15 mots) pour combattre l'addiction. Ton : Khoya/Khti marocain, direct. Langue : Français.";
      const result = await this.model.generateContent(prompt);
      return (await result.response).text();
    } catch (e) {
      return "Aujourd'hui, essaie de marcher 15 minutes sans ton téléphone.";
    }
  }

  // --- ANALYSE HEBDOMADAIRE DU JOURNAL ---
  async analyzeWeeklyJournal(journalEntries: any[]) {
    if (!journalEntries || journalEntries.length === 0) {
      return JSON.stringify({
        score: 0,
        stressLevel: 0,
        motivation: 0,
        triggers: [],
        summary: "Pas assez de données pour une analyse cette semaine."
      });
    }

    const textData = journalEntries.map(entry => 
      `- Humeur ${entry.mood}/5: "${entry.content}"`
    ).join('\n');

    const prompt = `
      Analyse ces entrées de journal :
      ${textData}

      Réponds UNIQUEMENT avec un objet JSON brut :
      {
        "score": (0-100),
        "stressLevel": (0-100),
        "motivation": (0-100),
        "triggers": (Tableau de 3 strings max),
        "summary": (Conseil Khoya/Khti en Français de 15 mots max)
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      let text = (await result.response).text();
      // Nettoyage du Markdown si Gemini en rajoute
      return text.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (e) {
      console.error("Erreur Analyse :", e);
      throw new Error("Impossible d'analyser le journal.");
    }
  }
}