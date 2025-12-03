import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createProfile(body: any): Promise<any>;
    updateCost(id: string, body: any): Promise<{
        id: string;
        email: string;
        password: string;
        username: string | null;
        addictionType: import(".prisma/client").$Enums.AddictionType;
        dailyCost: number | null;
        usageTime: number | null;
        startDate: Date;
        lastRelapse: Date | null;
        currentStreak: number;
        bestStreak: number;
        moneySaved: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(body: any): Promise<{
        id: string;
        email: string;
        password: string;
        username: string | null;
        addictionType: import(".prisma/client").$Enums.AddictionType;
        dailyCost: number | null;
        usageTime: number | null;
        startDate: Date;
        lastRelapse: Date | null;
        currentStreak: number;
        bestStreak: number;
        moneySaved: number;
        createdAt: Date;
        updatedAt: Date;
    } | {
        status: string;
        message: string;
    }>;
    getStats(id: string): Promise<{
        days: number;
        money: number;
        mood: string;
        username?: undefined;
    } | {
        days: number;
        money: number;
        username: string;
        mood?: undefined;
    }>;
}
