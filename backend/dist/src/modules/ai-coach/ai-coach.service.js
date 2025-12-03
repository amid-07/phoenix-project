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
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
    }
    async getAdvice(userMessage) {
        const systemPrompt = `
      RÔLE :
      Tu es Phoenix, un assistant virtuel spécialisé EXCLUSIVEMENT dans l'aide au sevrage (drogue, jeu, alcool, écrans, tabac) et le soutien psychologique.

      RÈGLES DE SÉCURITÉ (OBLIGATOIRES) :
      1. **HORS-SUJET :** Si l'utilisateur te parle de sujets sans rapport avec sa santé mentale ou ses habitudes (ex: code, cuisine, politique, sport, mathématiques), tu dois REFUSER de répondre. Dis gentiment : "Je suis là uniquement pour t'aider dans ton parcours de rétablissement, pas pour discuter de ce sujet."
      2. **DISCLAIMER MÉDICAL :** Tu n'es PAS médecin. Ne fais jamais de diagnostic médical, ne prescris jamais de médicaments. Rappelle que tu es une IA de soutien.
      3. **URGENCE :** Si l'utilisateur mentionne une envie de suicide, d'automutilation ou une overdose, dis-lui IMMÉDIATEMENT d'appeler les urgences (112 ou 15) et ne donne pas d'autres conseils.

      TON :
      Empathique, encourageant, court et direct.

      CONTEXTE UTILISATEUR :
      L'utilisateur te dit : "${userMessage}"
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
      Positif et réalisable en 5 min. Pas de guillemets.
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
                summary: "Pas assez de données."
            });
        }
        const textData = journalEntries.map(entry => `- Date: ${entry.createdAt.toDateString()}, Humeur: ${entry.mood}/5, Texte: "${entry.content}"`).join('\n');
        const prompt = `
      Analyse ces entrées de journal d'un patient en sevrage :
      ${textData}

      Tu dois agir comme un algorithme d'analyse psychologique.
      Ne réponds PAS avec du texte normal. Réponds UNIQUEMENT avec un objet JSON valide suivant cette structure exacte :
      {
        "score": (Nombre entre 0 et 100, où 100 est une santé mentale parfaite),
        "stressLevel": (Nombre entre 0 et 100, niveau de stress détecté),
        "motivation": (Nombre entre 0 et 100, niveau de détermination perçu),
        "triggers": (Tableau de strings, liste des 3 principaux déclencheurs identifiés ex: ["Travail", "Solitude"]),
        "summary": (String, une phrase de conseil percutante de 15 mots max)
      }
      Réponds en Français. Pas de balises markdown, juste le JSON brut.
    `;
        const result = await this.model.generateContent(prompt);
        let text = (await result.response).text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return text;
    }
};
exports.AiCoachService = AiCoachService;
exports.AiCoachService = AiCoachService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiCoachService);
//# sourceMappingURL=ai-coach.service.js.map