export declare class UsersService {
    createUser(data: any): Promise<any>;
    updateUserCost(userId: string, cost: number): Promise<{
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
    loginUser(data: any): Promise<{
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
    getUserStats(userId: string): Promise<{
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
