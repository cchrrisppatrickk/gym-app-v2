import { PrismaService } from '../prisma/prisma.service';
import { OpenBoxDto } from './dto/open-box.dto';
import { CloseBoxDto } from './dto/close-box.dto';
export declare class CashRegisterService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOpenBox(userId: number): Promise<{
        id: number;
        userId: number;
        openingAmount: import("@prisma/client/runtime/library").Decimal;
        openingDate: Date;
        closingAmountSys: import("@prisma/client/runtime/library").Decimal | null;
        closingAmountReal: import("@prisma/client/runtime/library").Decimal | null;
        closingDate: Date | null;
        status: import("@prisma/client").$Enums.CashRegisterStatus;
    } | null>;
    openBox(userId: number, dto: OpenBoxDto): Promise<{
        id: number;
        userId: number;
        openingAmount: import("@prisma/client/runtime/library").Decimal;
        openingDate: Date;
        closingAmountSys: import("@prisma/client/runtime/library").Decimal | null;
        closingAmountReal: import("@prisma/client/runtime/library").Decimal | null;
        closingDate: Date | null;
        status: import("@prisma/client").$Enums.CashRegisterStatus;
    }>;
    closeBox(userId: number, dto: CloseBoxDto): Promise<{
        id: number;
        userId: number;
        openingAmount: import("@prisma/client/runtime/library").Decimal;
        openingDate: Date;
        closingAmountSys: import("@prisma/client/runtime/library").Decimal | null;
        closingAmountReal: import("@prisma/client/runtime/library").Decimal | null;
        closingDate: Date | null;
        status: import("@prisma/client").$Enums.CashRegisterStatus;
    }>;
}
