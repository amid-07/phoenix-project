export declare class MarketplaceService {
    getAllCoaches(): Promise<({
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
    })[]>;
    getCoachDetails(coachUserId: string): Promise<{
        professionalProfile: {
            availabilities: {
                id: string;
                date: Date;
                isBooked: boolean;
                profileId: string;
            }[];
            reviews: ({
                author: {
                    username: string;
                };
            } & {
                id: string;
                rating: number;
                comment: string;
                createdAt: Date;
                profileId: string;
                authorId: string;
            })[];
        } & {
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
    }>;
    addReview(userId: string, coachId: string, rating: number, comment: string): Promise<{
        id: string;
        rating: number;
        comment: string;
        createdAt: Date;
        profileId: string;
        authorId: string;
    }>;
}
