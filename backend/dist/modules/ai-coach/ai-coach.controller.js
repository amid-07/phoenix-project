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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCoachController = void 0;
const common_1 = require("@nestjs/common");
const ai_coach_service_1 = require("./ai-coach.service");
let AiCoachController = class AiCoachController {
    constructor(aiCoachService) {
        this.aiCoachService = aiCoachService;
    }
    async chat(message) {
        console.log("📩 [CHAT] Message reçu du téléphone :", message);
        try {
            const aiResponse = await this.aiCoachService.getAdvice(message);
            console.log("🤖 [CHAT] Réponse de Gemini générée :", aiResponse);
            return { text: aiResponse };
        }
        catch (error) {
            console.error("❌ Erreur Gemini (Chat) :", error);
            return { text: "Désolé, je rencontre un problème de connexion. Réessayez plus tard." };
        }
    }
    async getChallenge() {
        console.log("💪 [CHALLENGE] Demande de génération de défi...");
        try {
            const challenge = await this.aiCoachService.getDailyChallenge();
            console.log("✨ [CHALLENGE] Défi envoyé :", challenge);
            return { text: challenge };
        }
        catch (error) {
            console.error("❌ Erreur Gemini (Challenge) :", error);
            return { text: "Prenez 5 minutes pour respirer calmement et boire un verre d'eau." };
        }
    }
};
exports.AiCoachController = AiCoachController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiCoachController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)('challenge'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiCoachController.prototype, "getChallenge", null);
exports.AiCoachController = AiCoachController = __decorate([
    (0, common_1.Controller)('ai-coach'),
    __metadata("design:paramtypes", [ai_coach_service_1.AiCoachService])
], AiCoachController);
//# sourceMappingURL=ai-coach.controller.js.map