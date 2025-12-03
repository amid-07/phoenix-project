export declare class BookingsService {
    createBooking(patientId: string, coachId: string, dateString: string): Promise<{
        id: string;
        date: Date;
        status: string;
        patientId: string;
        coachId: string;
        createdAt: Date;
    }>;
    getMyBookings(userId: string): Promise<({
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
    getCoachBookings(coachId: string): Promise<({
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
    updateStatus(bookingId: string, newStatus: string): Promise<{
        id: string;
        date: Date;
        status: string;
        patientId: string;
        coachId: string;
        createdAt: Date;
    }>;
}
