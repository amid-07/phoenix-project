import { JournalService } from './journal.service';
export declare class JournalController {
    private readonly journalService;
    constructor(journalService: JournalService);
    create(body: any): Promise<{
        id: string;
        content: string;
        mood: number;
        createdAt: Date;
        userId: string;
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        content: string;
        mood: number;
        createdAt: Date;
        userId: string;
    }[]>;
}
