import { PrismaService } from '../prisma/prisma.service';
import { CashRegisterService } from '../cash-register/cash-register.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayMembershipDto } from './dto/pay-membership.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
export declare class MembershipsService {
    private readonly prisma;
    private readonly cashRegisterService;
    constructor(prisma: PrismaService, cashRegisterService: CashRegisterService);
    findAll(): Promise<({
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            roleId: number;
            dni: string | null;
            email: string | null;
            password: string | null;
            fullName: string;
            phone: string | null;
            photoUrl: string | null;
            qrCode: string | null;
            isActive: boolean;
            deletedAt: Date | null;
        };
        plan: {
            id: number;
            name: string;
            deletedAt: Date | null;
            durationDays: number;
            price: import("@prisma/client/runtime/library").Decimal;
            allowsFreeze: boolean;
            description: string | null;
        };
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
    })[]>;
    create(dto: CreateMembershipDto): Promise<{
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
    payDebt(membershipId: number, dto: PayMembershipDto): Promise<{
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
