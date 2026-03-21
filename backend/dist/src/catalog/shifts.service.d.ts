import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
export declare class ShiftsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateShiftDto): Promise<{
        name: string;
        startTime: Date;
        endTime: Date;
        deletedAt: Date | null;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        startTime: Date;
        endTime: Date;
        deletedAt: Date | null;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        startTime: Date;
        endTime: Date;
        deletedAt: Date | null;
        id: number;
    } | null>;
    update(id: number, data: Partial<CreateShiftDto>): Promise<{
        name: string;
        startTime: Date;
        endTime: Date;
        deletedAt: Date | null;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        startTime: Date;
        endTime: Date;
        deletedAt: Date | null;
        id: number;
    }>;
}
