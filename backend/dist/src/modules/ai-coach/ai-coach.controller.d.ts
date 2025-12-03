import { AiCoachService } from './ai-coach.service';
import { JournalService } from '../journal/journal.service';
export declare class AiCoachController {
    private readonly aiCoachService;
    private readonly journalService;
    constructor(aiCoachService: AiCoachService, journalService: JournalService);
    chat(message: string): Promise<{
        text: any;
    }>;
    getChallenge(): Promise<{
        text: any;
    }>;
    getWeeklyAnalysis(userId: string): Promise<any>;
}
