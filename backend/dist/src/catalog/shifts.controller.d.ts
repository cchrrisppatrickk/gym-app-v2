import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    create(createShiftDto: CreateShiftDto): Promise<{
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
    update(id: number, updateShiftDto: Partial<CreateShiftDto>): Promise<{
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
