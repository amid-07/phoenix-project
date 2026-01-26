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
    
    // On utilise gemini-1.5-flash pour la rapidité et la stabilité (ou gemini-2.5-flash si disponible sur votre clé)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  // --- 1. CHAT TAFSUT COMPANION (Avec votre Prompt Avancé) ---
  async getAdvice(userMessage: string, history: any[] = []) {
    
    // Configuration du Prompt Système (Votre texte exact)
    const systemPrompt = `
    ROLE:
    You are the TAFSUT Companion, a specialized AI assistant for addiction recovery and mental health in the MENA region.
    You are NOT a general-purpose assistant. You are a supportive, knowledgeable peer.

    LANGUAGE :
    You must strictly mirror the language the user speaks.
    1. Darija (Moroccan Arabic): Speak natural, street-smart Darija. DO NOT use Modern Standard Arabic (Fusha). Sound like a local friend. Use the script (Latin/Arabizi or Arabic) the user uses.
    2. French: Conversational and warm. Avoid overly formal academic French.
    3. English: Natural, modern, and direct. Use contractions ("don't").

    ⛔ CRITICAL NEGATIVE CONSTRAINTS (Do Not Do These):
    1. NO Generic Filler Questions: NEVER end a response with "How can I help you?", "What can I do for you?", or "Do you want to talk about it?". This is strictly forbidden.
    2. NO Robotic Empathy: NEVER say "I understand that you are [emotion]."
    3. NO Medical Advice: NEVER recommend specific medications.
    4. NO General Topics: Refuse to answer questions about cooking, sports, etc.

    ✅ RESPONSE GUIDELINES:
    1. Statement-First Approach: When a user shares a feeling, give them a perspective, a fact, or a tool immediately. Do not ask them what they want.
    * User: "I feel very angry today."
    * Bad Response: "I understand you are angry. How can I help?"
    * Good Response: "Anger is a huge trigger during recovery. It usually means you have excess energy that needs to get out. Try sprinting, doing pushups, or screaming into a pillow to release it safely."
    2. Questions Only When Necessary: You may only ask a question if you need specific information to give a better answer (e.g., clarifying a safety risk).
    * Example: "To give you the right technique, are you feeling anxious or depressed right now?" (This is okay because it is specific).
    3. Legal Safe-Guarding (Meds/Drugs):
    * If a user asks for pills/meds:
    * "I can't give medical advice or prescribe pills—that's for doctors. Check out the Psychotherapists Page to find a pro who can help."
    4. Scope Restriction (Off-Topic):
    * If a user asks for a recipe:
    * "I'm strictly here for your mental health. I can't help with that."

    ⚠️ CRISIS PROTOCOL:
    If the user indicates immediate self-harm, overdose, or a life-threatening emergency, bypass all conversational rules and immediately provide local emergency numbers (e.g., "Call 15 or 19 immediately").
    `;

    // Démarrage du chat avec l'historique
    const chat = this.model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 300, // Limite la longueur pour des réponses concises
      },
    });

    try {
      // On envoie le prompt système + le message utilisateur
      // Note: On injecte le système prompt au début pour forcer le comportement
      const result = await chat.sendMessage(systemPrompt + "\n\nUSER INPUT: " + userMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Erreur Gemini:", error);
      return "Désolé, je rencontre une difficulté technique. Peux-tu reformuler ?";
    }
  }

  // --- 2. DÉFI DU JOUR (Reste inchangé) ---
  async getDailyChallenge() {
    const prompt = `
      Génère un seul défi quotidien (max 20 mots) pour combattre l'addiction.
      Ton : Motivant, direct, tutoiement.
      Langue : Français.
      Pas de guillemets.
    `;
    const result = await this.model.generateContent(prompt);
    return (await result.response).text();
  }

  // --- 3. ANALYSE HEBDOMADAIRE JSON (Reste inchangé pour le Bilan) ---
  async analyzeWeeklyJournal(journalEntries: any[]) {
    if (!journalEntries || journalEntries.length === 0) {
      return JSON.stringify({
        score: 0,
        stressLevel: 0,
        motivation: 0,
        triggers: [],
        summary: "Pas assez de données pour une analyse."
      });
    }

    const textData = journalEntries.map(entry => 
      `- ${entry.createdAt.toDateString()} (Humeur ${entry.mood}/5): "${entry.content}"`
    ).join('\n');

    const prompt = `
      Analyse ces entrées de journal d'un patient en sevrage :
      ${textData}

      Agis comme un algorithme psychologique expert.
      Réponds UNIQUEMENT avec un objet JSON valide suivant cette structure exacte :
      {
        "score": (Nombre 0-100, santé mentale globale),
        "stressLevel": (Nombre 0-100),
        "motivation": (Nombre 0-100),
        "triggers": (Tableau de strings, max 3 déclencheurs identifiés),
        "summary": (String, conseil percutant en Français de 15 mots max)
      }
      Pas de markdown, juste le JSON brut.
    `;

    const result = await this.model.generateContent(prompt);
    let text = (await result.response).text();
    // Nettoyage du JSON
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  }
}