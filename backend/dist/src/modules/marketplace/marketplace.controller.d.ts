import { MarketplaceService } from './marketplace.service';
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    getCoaches(): Promise<({
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
    getDetails(id: string): Promise<{
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
    postReview(body: any): Promise<{
        id: string;
        rating: number;
        comment: string;
        createdAt: Date;
        profileId: string;
        authorId: string;
    }>;
}
