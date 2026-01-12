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
        console.log("📝 Inscription :", data.email);
        let existingUser = null;
        if (data.email) {
            existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        }
        if (existingUser) {
            if (data.dailyCost) {
                return await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { dailyCost: parseFloat(data.dailyCost) },
                });
            }
            return existingUser;
        }
        let finalUsername = data.username;
        if (data.isAnonymous) {
            finalUsername = `Warrior_${Math.floor(Math.random() * 10000)}`;
        }
        const role = data.role === 'COACH' ? 'COACH' : 'USER';
        const isVerified = role === 'USER';
        return await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                username: finalUsername,
                role: role,
                isVerified: isVerified,
                addictionType: 'SMOKING',
                dailyCost: data.dailyCost ? parseFloat(data.dailyCost) : null,
                startDate: new Date(),
                moneySaved: 0,
                currentStreak: 0,
                professionalProfile: role === 'COACH' ? {
                    create: {
                        title: "Nouveau Coach",
                        bio: "Biographie à compléter...",
                        hourlyRate: 50,
                        specialties: []
                    }
                } : undefined
            },
        });
    }
    async loginUser(data) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user || user.password !== data.password)
            return null;
        if (user.role === 'COACH' && !user.isVerified) {
            throw new Error("Votre compte est en attente de validation.");
        }
        return user;
    }
    async updateUserCost(userId, cost) {
        return await prisma.user.update({
            where: { id: userId },
            data: { dailyCost: cost, startDate: new Date() },
        });
    }
    async reportRelapse(userId) {
        return await prisma.user.update({
            where: { id: userId },
            data: { startDate: new Date(), currentStreak: 0 },
        });
    }
    async getUserStats(userId) {
        var _a;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { professionalProfile: true }
        });
        if (!user)
            return { days: 0, money: 0, badges: [] };
        if (user.role === 'COACH') {
            const reservationsCount = await prisma.booking.count({ where: { coachId: userId } });
            const paidBookings = await prisma.booking.count({
                where: { coachId: userId, OR: [{ status: 'COMPLETED' }, { status: 'CONFIRMED', type: 'REMOTE' }] }
            });
            const hourlyRate = ((_a = user.professionalProfile) === null || _a === void 0 ? void 0 : _a.hourlyRate) || 0;
            return {
                role: 'COACH',
                username: user.username,
                reservationsCount,
                earnings: paidBookings * hourlyRate,
                hourlyRate
            };
        }
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - user.startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const money = diffDays * (user.dailyCost || 0);
        await this.checkAndAwardBadges(userId, diffDays);
        const unlockedBadges = await prisma.userBadge.findMany({
            where: { userId: userId }, include: { badge: true }
        });
        return {
            role: 'USER',
            days: diffDays,
            money: Math.floor(money),
            username: user.username,
            badges: unlockedBadges.map(ub => ub.badge)
        };
    }
    async checkAndAwardBadges(userId, currentDays) {
        const allBadges = await prisma.badge.findMany();
        for (const badge of allBadges) {
            if (currentDays >= badge.requiredDays) {
                const alreadyHas = await prisma.userBadge.findFirst({ where: { userId: userId, badgeId: badge.id } });
                if (!alreadyHas) {
                    await prisma.userBadge.create({ data: { userId: userId, badgeId: badge.id } });
                }
            }
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map