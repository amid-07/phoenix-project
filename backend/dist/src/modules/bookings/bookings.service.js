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
    async createBooking(patientId, coachId, dateString) {
        console.log(`📅 Nouvelle réservation pour le : ${dateString}`);
        return await prisma.booking.create({
            data: {
                patientId: patientId,
                coachId: coachId,
                date: new Date(dateString),
                status: 'PENDING'
            }
        });
    }
    async getMyBookings(userId) {
        return await prisma.booking.findMany({
            where: { patientId: userId },
            include: { coach: { include: { professionalProfile: true } } }
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
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)()
], BookingsService);
//# sourceMappingURL=bookings.service.js.map