import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(createPlanDto: CreatePlanDto): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
    } | null>;
    update(id: number, updatePlanDto: Partial<CreatePlanDto>): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
    }>;
}
