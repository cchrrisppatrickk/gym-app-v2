import { SalesService } from './sales.service';
import { CreateProductSaleDto } from './dto/create-product-sale.dto';
import { CreateDayPassDto } from './dto/create-day-pass.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    sellProducts(req: any, dto: CreateProductSaleDto): Promise<({
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
    sellDayPass(req: any, dto: CreateDayPassDto): Promise<{
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
