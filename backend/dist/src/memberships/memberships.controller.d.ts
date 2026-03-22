import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayDebtDto } from './dto/pay-debt.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
    create(req: any, createMembershipDto: CreateMembershipDto): Promise<({
        payments: {
            id: number;
            membershipId: number;
            cashRegisterId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: string;
            date: Date;
            notes: string | null;
        }[];
    } & {
        id: number;
        userId: number;
        planId: number;
        shiftId: number;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.MembershipStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    payDebt(id: number, payDebtDto: PayDebtDto, req: any): Promise<{
        message: string;
        payment: {
            id: number;
            membershipId: number;
            cashRegisterId: number;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: string;
            date: Date;
            notes: string | null;
        };
        newPendingBalance: number;
    }>;
    freeze(id: number, freezeMembershipDto: FreezeMembershipDto): Promise<{
        freezes: {
            id: number;
            startDate: Date;
            endDate: Date;
            membershipId: number;
            reason: string | null;
        }[];
    } & {
        id: number;
        userId: number;
        planId: number;
        shiftId: number;
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.MembershipStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
