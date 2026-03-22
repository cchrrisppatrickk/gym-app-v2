import { PrismaService } from '../prisma/prisma.service';
import { CashRegisterService } from '../cash-register/cash-register.service';
import { CreateProductSaleDto } from './dto/create-product-sale.dto';
import { CreateDayPassDto } from './dto/create-day-pass.dto';
export declare class SalesService {
    private readonly prisma;
    private readonly cashRegisterService;
    constructor(prisma: PrismaService, cashRegisterService: CashRegisterService);
    sellProducts(employeeId: number, dto: CreateProductSaleDto): Promise<({
        details: {
            id: number;
            saleId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            productId: number;
        }[];
    } & {
        id: number;
        paymentMethod: string;
        date: Date;
        cashRegisterId: number;
        type: import("@prisma/client").$Enums.SaleType;
        total: import("@prisma/client/runtime/library").Decimal;
    }) | null>;
    sellDayPass(employeeId: number, dto: CreateDayPassDto): Promise<{
        message: string;
        sale: {
            id: number;
            paymentMethod: string;
            date: Date;
            cashRegisterId: number;
            type: import("@prisma/client").$Enums.SaleType;
            total: import("@prisma/client/runtime/library").Decimal;
        };
        qrCode: string;
    }>;
}
