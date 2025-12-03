import { AiCoachService } from './ai-coach.service';
export declare class AiCoachController {
    private readonly aiCoachService;
    constructor(aiCoachService: AiCoachService);
    chat(message: string): Promise<{
        text: any;
    }>;
    getChallenge(): Promise<{
        text: any;
    }>;
}
