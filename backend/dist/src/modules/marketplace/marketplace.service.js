"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let MarketplaceService = class MarketplaceService {
    async getAllCoaches() {
        return await prisma.user.findMany({
            where: { role: 'COACH' },
            include: {
                professionalProfile: true
            },
        });
    }
    async searchCoaches(query) {
        const { search, city, type } = query;
        return await prisma.user.findMany({
            where: {
                role: 'COACH',
                professionalProfile: {
                    AND: [
                        search ? {
                            OR: [
                                { title: { contains: search, mode: 'insensitive' } },
                                { bio: { contains: search, mode: 'insensitive' } },
                                { user: { username: { contains: search, mode: 'insensitive' } } }
                            ]
                        } : {},
                        city ? { address: { contains: city, mode: 'insensitive' } } : {},
                        type ? {
                            availabilities: {
                                some: { type: type, isBooked: false }
                            }
                        } : {}
                    ]
                }
            },
            include: { professionalProfile: true },
        });
    }
    async getCoachDetails(coachUserId) {
        const coach = await prisma.user.findUnique({
            where: { id: coachUserId },
            include: {
                professionalProfile: {
                    include: {
                        availabilities: {
                            where: {
                                isBooked: false,
                                date: { gte: new Date() }
                            },
                            orderBy: { date: 'asc' }
                        },
                        reviews: {
                            orderBy: { createdAt: 'desc' },
                            include: {
                                author: { select: { username: true } }
                            }
                        }
                    }
                }
            }
        });
        return coach;
    }
    async updateCoachProfile(userId, data) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { professionalProfile: true }
        });
        if (!user || !user.professionalProfile) {
            throw new Error("Profil introuvable");
        }
        return await prisma.professionalProfile.update({
            where: { id: user.professionalProfile.id },
            data: {
                title: data.title,
                bio: data.bio,
                hourlyRate: parseFloat(data.hourlyRate),
                address: data.address,
                specialties: data.specialties
            }
        });
    }
    async addReview(userId, coachId, rating, comment) {
        const coach = await prisma.user.findUnique({
            where: { id: coachId },
            include: { professionalProfile: true }
        });
        if (!coach || !coach.professionalProfile) {
            throw new Error("Coach introuvable");
        }
        return await prisma.review.create({
            data: {
                rating,
                comment,
                authorId: userId,
                profileId: coach.professionalProfile.id
            }
        });
    }
    async addAvailability(userId, dateString, type) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { professionalProfile: true }
        });
        if (!user || !user.professionalProfile)
            throw new Error("Profil pro introuvable");
        return await prisma.availability.create({
            data: {
                date: new Date(dateString),
                isBooked: false,
                type: type,
                profileId: user.professionalProfile.id
            }
        });
    }
    async getCoachAvailabilities(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { professionalProfile: true }
        });
        if (!(user === null || user === void 0 ? void 0 : user.professionalProfile))
            return [];
        return await prisma.availability.findMany({
            where: {
                profileId: user.professionalProfile.id,
                isBooked: false,
                date: { gte: new Date() }
            },
            orderBy: { date: 'asc' }
        });
    }
    async updateAddress(userId, address) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { professionalProfile: true }
        });
        if (!(user === null || user === void 0 ? void 0 : user.professionalProfile))
            throw new Error("Profil introuvable");
        return await prisma.professionalProfile.update({
            where: { id: user.professionalProfile.id },
            data: { address: address }
        });
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)()
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map