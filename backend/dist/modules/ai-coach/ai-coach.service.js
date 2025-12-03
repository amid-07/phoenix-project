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
        const prompt = `
      Tu es Phoenix, un coach expert en addiction (drogue, jeu, téléphone).
      Ton but est d'être empathique, motivant, mais ferme.
      L'utilisateur te dit : "${userMessage}".
      Réponds en 2 ou 3 phrases maximum avec un conseil concret.
    `;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    async getDailyChallenge() {
        const prompt = `
      Génère un seul défi quotidien concret (maximum 20 mots) pour une personne qui combat une addiction.
      Le défi doit être positif et réalisable en 5 minutes.
      Exemple : "Bois un grand verre d'eau et respire 10 fois."
      Ne mets pas de guillemets, juste le texte.
    `;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
};
exports.AiCoachService = AiCoachService;
exports.AiCoachService = AiCoachService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiCoachService);
//# sourceMappingURL=ai-coach.service.js.map