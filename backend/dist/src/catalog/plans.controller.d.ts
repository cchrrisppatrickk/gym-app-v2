import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(createPlanDto: CreatePlanDto): Promise<{
        name: string;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
        deletedAt: Date | null;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
        deletedAt: Date | null;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
        deletedAt: Date | null;
        id: number;
    } | null>;
    update(id: number, updatePlanDto: Partial<CreatePlanDto>): Promise<{
        name: string;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
        deletedAt: Date | null;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        durationDays: number;
        price: import("@prisma/client/runtime/library").Decimal;
        allowsFreeze: boolean;
        description: string | null;
        deletedAt: Date | null;
        id: number;
    }>;
}
