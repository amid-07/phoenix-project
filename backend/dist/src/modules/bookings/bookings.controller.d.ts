import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(body: any): Promise<{
        id: string;
        date: Date;
        status: string;
        patientId: string;
        coachId: string;
        createdAt: Date;
    }>;
    getMy(id: string): Promise<({
        coach: {
            professionalProfile: {
                id: string;
                title: string;
                bio: string;
                specialties: string[];
                hourlyRate: number;
                rating: number;
                userId: string;
            };
        } & {
            id: string;
            email: string;
            password: string;
            username: string | null;
            role: import(".prisma/client").$Enums.Role;
            addictionType: import(".prisma/client").$Enums.AddictionType;
            dailyCost: number | null;
            startDate: Date;
            moneySaved: number;
            currentStreak: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        date: Date;
        status: string;
        patientId: string;
        coachId: string;
        createdAt: Date;
    })[]>;
    getForCoach(id: string): Promise<({
        patient: {
            id: string;
            email: string;
            password: string;
            username: string | null;
            role: import(".prisma/client").$Enums.Role;
            addictionType: import(".prisma/client").$Enums.AddictionType;
            dailyCost: number | null;
            startDate: Date;
            moneySaved: number;
            currentStreak: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        date: Date;
        status: string;
        patientId: string;
        coachId: string;
        createdAt: Date;
    })[]>;
    changeStatus(id: string, status: string): Promise<{
        id: string;
        date: Date;
        status: string;
        patientId: string;
        coachId: string;
        createdAt: Date;
    }>;
}
