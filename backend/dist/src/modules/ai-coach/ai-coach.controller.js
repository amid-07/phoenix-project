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
const journal_service_1 = require("../journal/journal.service");
let AiCoachController = class AiCoachController {
    constructor(aiCoachService, journalService) {
        this.aiCoachService = aiCoachService;
        this.journalService = journalService;
    }
    async chat(message) {
        try {
            return { text: await this.aiCoachService.getAdvice(message) };
        }
        catch (e) {
            return { text: "Erreur" };
        }
    }
    async getChallenge() {
        try {
            return { text: await this.aiCoachService.getDailyChallenge() };
        }
        catch (e) {
            return { text: "Erreur" };
        }
    }
    async getWeeklyAnalysis(userId) {
        console.log("🧠 Analyse structurée demandée pour :", userId);
        try {
            const entries = await this.journalService.getWeeklyEntries(userId);
            const rawJson = await this.aiCoachService.analyzeWeeklyJournal(entries);
            const analysisData = JSON.parse(rawJson);
            return analysisData;
        }
        catch (error) {
            console.error("❌ Erreur Analyse :", error);
            return {
                score: 50,
                stressLevel: 50,
                motivation: 50,
                triggers: ["Analyse impossible"],
                summary: "Veuillez réessayer plus tard."
            };
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
__decorate([
    (0, common_1.Get)('analysis/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiCoachController.prototype, "getWeeklyAnalysis", null);
exports.AiCoachController = AiCoachController = __decorate([
    (0, common_1.Controller)('ai-coach'),
    __metadata("design:paramtypes", [ai_coach_service_1.AiCoachService,
        journal_service_1.JournalService])
], AiCoachController);
//# sourceMappingURL=ai-coach.controller.js.map