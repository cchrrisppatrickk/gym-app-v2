import { PrismaService } from '../prisma/prisma.service';
import { CashRegisterService } from '../cash-register/cash-register.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayDebtDto } from './dto/pay-debt.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
import { RegisterMemberDto } from './dto/register-member.dto';
export declare class MembershipsService {
    private readonly prisma;
    private readonly cashRegisterService;
    constructor(prisma: PrismaService, cashRegisterService: CashRegisterService);
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
