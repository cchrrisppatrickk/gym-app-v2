import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
    create(req: any, createMembershipDto: CreateMembershipDto): Promise<({
        payments: {
            id: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: string;
            date: Date;
            notes: string | null;
            membershipId: number;
            cashRegisterId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: import("@prisma/client").$Enums.MembershipStatus;
        planId: number;
        shiftId: number;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
    }) | null>;
}
