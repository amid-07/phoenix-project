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
        username?: undefined;
        role?: undefined;
    } | {
        days: number;
        money: number;
        username: string;
        role: import(".prisma/client").$Enums.Role;
        badges: {
            id: string;
            name: string;
            description: string;
            iconName: string;
            requiredDays: number;
        }[];
    }>;
    private checkAndAwardBadges;
}
