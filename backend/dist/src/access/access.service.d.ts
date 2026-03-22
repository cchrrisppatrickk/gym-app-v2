import { PrismaService } from '../prisma/prisma.service';
export declare class AccessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    scanQr(userId: number): Promise<{
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
