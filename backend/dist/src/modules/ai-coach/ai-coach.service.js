"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCoachService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("@nestjs/config");
let AiCoachService = class AiCoachService {
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
    async getAdvice(userMessage) {
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
    2. Questions Only When Necessary: You may only ask a question if you need specific information to give a better answer (e.g., clarifying a safety risk).
    3. Legal Safe-Guarding (Meds/Drugs):
       If a user asks for pills/meds: "I can't give medical advice or prescribe pills—that's for doctors. Check out the Experts Page to find a pro who can help."
    4. Scope Restriction (Off-Topic):
       If a user asks for a recipe or general info: "I'm strictly here for your mental health. I can't help with that."

    ⚠️ CRISIS PROTOCOL:
    If the user indicates immediate self-harm, overdose, or a life-threatening emergency, bypass all conversational rules and immediately provide local emergency numbers (e.g., "Call 15 or 19 immediately").

    USER INPUT:
    "${userMessage}"
    `;
        try {
            const result = await this.model.generateContent(systemPrompt);
            return (await result.response).text();
        }
        catch (error) {
            console.error("Erreur Gemini:", error);
            return "Désolé, je suis un peu fatigué. Peux-tu répéter ?";
        }
    }
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
    async analyzeWeeklyJournal(journalEntries) {
        if (!journalEntries || journalEntries.length === 0) {
            return JSON.stringify({
                score: 0,
                stressLevel: 0,
                motivation: 0,
                triggers: [],
                summary: "Pas assez de données pour une analyse."
            });
        }
        const textData = journalEntries.map(entry => `- ${entry.createdAt.toDateString()} (Humeur ${entry.mood}/5): "${entry.content}"`).join('\n');
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
        return text.replace(/```json/g, '').replace(/```/g, '').trim();
    }
};
exports.AiCoachService = AiCoachService;
exports.AiCoachService = AiCoachService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiCoachService);
//# sourceMappingURL=ai-coach.service.js.map