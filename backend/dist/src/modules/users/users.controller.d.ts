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
        role: import(".prisma/client").$Enums.Role;
        addictionType: import(".prisma/client").$Enums.AddictionType;
        dailyCost: number | null;
        startDate: Date;
        moneySaved: number;
        currentStreak: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(body: any): Promise<{
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
    } | {
        status: string;
        message: string;
    }>;
    getStats(id: string): Promise<{
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
    relapse(id: string): Promise<{
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
}
