import { CashRegisterService } from './cash-register.service';
import { OpenBoxDto } from './dto/open-box.dto';
import { CloseBoxDto } from './dto/close-box.dto';
export declare class CashRegisterController {
    private readonly cashRegisterService;
    constructor(cashRegisterService: CashRegisterService);
    getCurrentBox(req: any): Promise<{
        id: number;
        userId: number;
        openingAmount: import("@prisma/client/runtime/library").Decimal;
        openingDate: Date;
        closingAmountSys: import("@prisma/client/runtime/library").Decimal | null;
        closingAmountReal: import("@prisma/client/runtime/library").Decimal | null;
        closingDate: Date | null;
        status: import("@prisma/client").$Enums.CashRegisterStatus;
    } | null>;
    open(req: any, openBoxDto: OpenBoxDto): Promise<{
        id: number;
        userId: number;
        openingAmount: import("@prisma/client/runtime/library").Decimal;
        openingDate: Date;
        closingAmountSys: import("@prisma/client/runtime/library").Decimal | null;
        closingAmountReal: import("@prisma/client/runtime/library").Decimal | null;
        closingDate: Date | null;
        status: import("@prisma/client").$Enums.CashRegisterStatus;
    }>;
    close(req: any, closeBoxDto: CloseBoxDto): Promise<{
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
