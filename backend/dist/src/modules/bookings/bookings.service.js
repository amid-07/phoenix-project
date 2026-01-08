"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let BookingsService = class BookingsService {
    async createBooking(patientId, coachId, dateString, availabilityId) {
        console.log(`📅 Réservation demandée : Patient ${patientId} -> Coach ${coachId}`);
        let sessionType = 'REMOTE';
        if (availabilityId) {
            const slot = await prisma.availability.findUnique({
                where: { id: availabilityId }
            });
            if (slot) {
                sessionType = slot.type;
            }
            await prisma.availability.update({
                where: { id: availabilityId },
                data: { isBooked: true }
            });
        }
        return await prisma.booking.create({
            data: {
                patientId: patientId,
                coachId: coachId,
                date: new Date(dateString),
                status: 'PENDING',
                type: sessionType
            }
        });
    }
    async getMyBookings(userId) {
        return await prisma.booking.findMany({
            where: { patientId: userId },
            include: {
                coach: { include: { professionalProfile: true } }
            },
            orderBy: { date: 'desc' }
        });
    }
    async getCoachBookings(coachId) {
        return await prisma.booking.findMany({
            where: { coachId: coachId },
            include: { patient: true },
            orderBy: { date: 'desc' }
        });
    }
    async updateStatus(bookingId, newStatus) {
        return await prisma.booking.update({
            where: { id: bookingId },
            data: { status: newStatus }
        });
    }
    async validateSession(bookingId, coachId) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });
        if (!booking)
            throw new Error("Réservation introuvable ou code invalide.");
        if (booking.coachId !== coachId)
            throw new Error("Ce n'est pas votre client !");
        if (booking.status === 'COMPLETED')
            throw new Error("Cette séance a déjà été validée.");
        console.log(`✅ Séance validée via Scan : ${bookingId}`);
        return await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'COMPLETED' }
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)()
], BookingsService);
//# sourceMappingURL=bookings.service.js.map