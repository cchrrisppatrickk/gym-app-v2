import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayDebtDto } from './dto/pay-debt.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
import { RegisterMemberDto } from './dto/register-member.dto';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
    registerNewMember(dto: RegisterMemberDto): Promise<{
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.MembershipStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        planId: number;
        shiftId: number;
    }>;
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
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.MembershipStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        planId: number;
        shiftId: number;
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
            startDate: Date;
            endDate: Date;
            id: number;
            membershipId: number;
            reason: string | null;
        }[];
    } & {
        startDate: Date;
        endDate: Date;
        status: import("@prisma/client").$Enums.MembershipStatus;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        pendingBalance: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        planId: number;
        shiftId: number;
    }>;
}
