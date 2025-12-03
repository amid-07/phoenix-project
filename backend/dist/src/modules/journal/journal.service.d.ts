export declare class JournalService {
    createEntry(userId: string, content: string, mood: number): Promise<{
        id: string;
        content: string;
        mood: number;
        createdAt: Date;
        userId: string;
    }>;
    getUserJournal(userId: string): Promise<{
        id: string;
        content: string;
        mood: number;
        createdAt: Date;
        userId: string;
    }[]>;
    getWeeklyEntries(userId: string): Promise<{
        id: string;
        content: string;
        mood: number;
        createdAt: Date;
        userId: string;
    }[]>;
}
