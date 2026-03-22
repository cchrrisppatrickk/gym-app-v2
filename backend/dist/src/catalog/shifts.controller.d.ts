import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    create(createShiftDto: CreateShiftDto): Promise<{
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
    update(id: number, updateShiftDto: Partial<CreateShiftDto>): Promise<{
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
