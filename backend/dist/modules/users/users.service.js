"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let UsersService = class UsersService {
    async createUser(data) {
        console.log("📝 Tentative d'inscription/mise à jour pour :", data.email);
        let existingUser = null;
        if (data.email) {
            existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });
        }
        if (existingUser) {
            console.log("-> L'utilisateur existe déjà.");
            if (data.dailyCost) {
                console.log("-> Mise à jour du coût journalier...");
                return await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { dailyCost: parseFloat(data.dailyCost) },
                });
            }
            return existingUser;
        }
        console.log("-> Création d'un nouveau profil...");
        return await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                username: data.username,
                addictionType: 'SMOKING',
                dailyCost: parseFloat(data.dailyCost) || 0,
                startDate: new Date(),
                moneySaved: 0,
                currentStreak: 0,
            },
        });
    }
    async updateUserCost(userId, cost) {
        console.log(`🔄 Mise à jour du coût pour l'ID : ${userId} -> ${cost}€`);
        return await prisma.user.update({
            where: { id: userId },
            data: {
                dailyCost: cost,
                startDate: new Date()
            },
        });
    }
    async loginUser(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user || user.password !== data.password) {
            return null;
        }
        return user;
    }
    async getUserStats(userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return { days: 0, money: 0, mood: '-' };
        }
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - user.startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const money = diffDays * (user.dailyCost || 0);
        return {
            days: diffDays,
            money: Math.floor(money),
            username: user.username
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map