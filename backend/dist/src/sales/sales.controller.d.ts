import { SalesService } from './sales.service';
import { CreateProductSaleDto } from './dto/create-product-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    sellProducts(req: any, dto: CreateProductSaleDto): Promise<({
        details: {
            id: number;
            saleId: number;
            productId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: number;
        cashRegisterId: number;
        type: import("@prisma/client").$Enums.SaleType;
        total: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string;
        date: Date;
    }) | null>;
}
