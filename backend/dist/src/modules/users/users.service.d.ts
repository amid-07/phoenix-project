export declare class UsersService {
    createUser(data: any): Promise<any>;
    updateUserCost(userId: string, cost: number): Promise<{
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
    loginUser(data: any): Promise<{
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
    reportRelapse(userId: string): Promise<{
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
    getUserStats(userId: string): Promise<{
        days: number;
        money: number;
        badges: any[];
        role?: undefined;
        username?: undefined;
        reservationsCount?: undefined;
        earnings?: undefined;
        hourlyRate?: undefined;
    } | {
        role: string;
        username: string;
        reservationsCount: number;
        earnings: number;
        hourlyRate: number;
        days?: undefined;
        money?: undefined;
        badges?: undefined;
    } | {
        role: string;
        days: number;
        money: number;
        username: string;
        badges: {
            id: string;
            name: string;
            description: string;
            iconName: string;
            requiredDays: number;
        }[];
        reservationsCount?: undefined;
        earnings?: undefined;
        hourlyRate?: undefined;
    }>;
    private checkAndAwardBadges;
}
