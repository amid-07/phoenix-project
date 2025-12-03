"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ai_coach_controller_1 = require("./modules/ai-coach/ai-coach.controller");
const users_controller_1 = require("./modules/users/users.controller");
const marketplace_controller_1 = require("./modules/marketplace/marketplace.controller");
const bookings_controller_1 = require("./modules/bookings/bookings.controller");
const journal_controller_1 = require("./modules/journal/journal.controller");
const ai_coach_service_1 = require("./modules/ai-coach/ai-coach.service");
const users_service_1 = require("./modules/users/users.service");
const marketplace_service_1 = require("./modules/marketplace/marketplace.service");
const bookings_service_1 = require("./modules/bookings/bookings.service");
const journal_service_1 = require("./modules/journal/journal.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true })],
        controllers: [
            ai_coach_controller_1.AiCoachController,
            users_controller_1.UsersController,
            marketplace_controller_1.MarketplaceController,
            bookings_controller_1.BookingsController,
            journal_controller_1.JournalController
        ],
        providers: [
            ai_coach_service_1.AiCoachService,
            users_service_1.UsersService,
            marketplace_service_1.MarketplaceService,
            bookings_service_1.BookingsService,
            journal_service_1.JournalService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map