import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
export declare class ShiftsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateShiftDto): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        startTime: Date;
        endTime: Date;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        startTime: Date;
        endTime: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        startTime: Date;
        endTime: Date;
    } | null>;
    update(id: number, data: Partial<CreateShiftDto>): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        startTime: Date;
        endTime: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        startTime: Date;
        endTime: Date;
    }>;
}
