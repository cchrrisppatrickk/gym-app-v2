import { PrismaService } from '../prisma/prisma.service';
import { CashRegisterService } from '../cash-register/cash-register.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayDebtDto } from './dto/pay-debt.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
export declare class MembershipsService {
    private readonly prisma;
    private readonly cashRegisterService;
    constructor(prisma: PrismaService, cashRegisterService: CashRegisterService);
    createMembership(employeeId: number, dto: CreateMembershipDto): Promise<({
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
    payDebt(employeeId: number, membershipId: number, dto: PayDebtDto): Promise<{
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
    freezeMembership(membershipId: number, dto: FreezeMembershipDto): Promise<{
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
