import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiCoachService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  
  // LE PROMPT SYSTÈME DÉFINITIF
  private systemPromptText = `
    ROLE:
    You are the TAFSUT Companion, a specialized AI assistant for addiction recovery in MENA.
    
    LANGUAGE:
    Strictly mirror the user's language (Darija, French, English).
    
    CONSTRAINTS:
    - NO generic filler questions like "How can I help?".
    - NO robotic empathy ("I understand...").
    - NO medical advice.
    
    GUIDELINES:
    - Statement-First Approach: Give value immediately.
    - Crisis Protocol: If self-harm/overdose -> "Call 15 or 19 immediately".
  `;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // On utilise systemInstruction pour définir le rôle proprement (Nécessite SDK récent)
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: {
        role: "system",
        parts: [{ text: this.systemPromptText }]
      }
    });
  }

  // --- 1. CHAT TAFSUT (CORRIGÉ) ---
  async getAdvice(userMessage: string, rawHistory: any[] = []) {
    try {
      // ÉTAPE CLÉ : NETTOYAGE DE L'HISTORIQUE
      // Gemini plante si l'historique commence par 'model'.
      let cleanHistory = [...rawHistory];

      // 1. Si l'historique n'est pas vide et commence par l'IA, on supprime le premier message
      if (cleanHistory.length > 0 && cleanHistory[0].role === 'model') {
        cleanHistory.shift();
      }

      // 2. On s'assure que le format est bon (parts: [{text: ...}])
      // (Normalement le frontend le fait, mais on sécurise)
      
      const chat = this.model.startChat({
        history: cleanHistory,
        generationConfig: {
          maxOutputTokens: 300,
        },
      });

      // On envoie juste le message (le System Prompt est déjà chargé dans le constructeur)
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error("❌ Erreur Gemini détaillée :", error); // Affiche la vraie erreur dans le terminal
      
      // Fallback : Si l'historique est corrompu, on réessaie SANS historique
      if (rawHistory.length > 0) {
        console.log("⚠️ Tentative de relance sans historique...");
        return this.getAdvice(userMessage, []);
      }
      
      return "Désolé, je rencontre une difficulté technique. Peux-tu reformuler ?";
    }
  }

  // --- 2. DÉFI DU JOUR ---
  async getDailyChallenge() {
    const prompt = `Génère un seul défi quotidien (max 20 mots) pour combattre l'addiction. Ton: Motivant, direct. Langue: Français.`;
    try {
      const result = await this.model.generateContent(prompt);
      return (await result.response).text();
    } catch (e) { return "Prends 5 minutes pour respirer."; }
  }

  // --- 3. ANALYSE HEBDOMADAIRE ---
  async analyzeWeeklyJournal(journalEntries: any[]) {
    if (!journalEntries || journalEntries.length === 0) {
      return JSON.stringify({
        score: 0, stressLevel: 0, motivation: 0, triggers: [], 
        summary: "Pas assez de données pour une analyse."
      });
    }

    const textData = journalEntries.map(entry => 
      `- ${entry.createdAt.toDateString()} (Humeur ${entry.mood}/5): "${entry.content}"`
    ).join('\n');

    const prompt = `
      Analyse ces entrées de journal :
      ${textData}
      Réponds UNIQUEMENT avec un JSON valide :
      { "score": 0-100, "stressLevel": 0-100, "motivation": 0-100, "triggers": ["Trigger1", "Trigger2"], "summary": "Conseil en 15 mots" }
      Pas de markdown.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      let text = (await result.response).text();
      return text.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (e) {
      console.error(e);
      throw new Error("Erreur IA Analyse");
    }
  }
}