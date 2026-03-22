import { AccessService } from './access.service';
export declare class AccessController {
    private readonly accessService;
    constructor(accessService: AccessService);
    scan(body: {
        userId: number;
    }): Promise<{
        status: string;
        message: string;
        user?: undefined;
        daysLeft?: undefined;
        pendingBalance?: undefined;
    } | {
        status: string;
        message: string;
        user: string;
        daysLeft: number;
        pendingBalance: number;
    } | {
        status: string;
        message: string;
        user: string;
        daysLeft: number;
        pendingBalance?: undefined;
    }>;
}
