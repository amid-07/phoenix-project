import { ConfigService } from '@nestjs/config';
export declare class AiCoachService {
    private configService;
    private genAI;
    private model;
    constructor(configService: ConfigService);
    getAdvice(userMessage: string): Promise<any>;
    getDailyChallenge(): Promise<any>;
}
