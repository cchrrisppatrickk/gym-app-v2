import { PrismaService } from '../prisma/prisma.service';
import { ValidateAccessDto } from './dto/validate-access.dto';
export declare class AccessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validateQr(dto: ValidateAccessDto): Promise<{
        status: string;
        message: string;
        debt?: undefined;
        user?: undefined;
    } | {
        status: string;
        message: string;
        debt: number;
        user: string;
    } | {
        status: string;
        message: string;
        user: string;
        debt?: undefined;
    }>;
}
