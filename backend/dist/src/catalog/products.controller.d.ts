import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        name: string;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        barcode: string | null;
        stock: number;
        deletedAt: Date | null;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        barcode: string | null;
        stock: number;
        deletedAt: Date | null;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        barcode: string | null;
        stock: number;
        deletedAt: Date | null;
        id: number;
    } | null>;
    update(id: number, updateProductDto: Partial<CreateProductDto>): Promise<{
        name: string;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        barcode: string | null;
        stock: number;
        deletedAt: Date | null;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        barcode: string | null;
        stock: number;
        deletedAt: Date | null;
        id: number;
    }>;
}
