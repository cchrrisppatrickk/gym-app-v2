import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayMembershipDto } from './dto/pay-membership.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
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
    create(createMembershipDto: CreateMembershipDto): Promise<{
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
    payDebt(id: number, dto: PayMembershipDto): Promise<{
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
