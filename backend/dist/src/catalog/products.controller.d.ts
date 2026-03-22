import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: string | null;
        barcode: string | null;
        stock: number;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: string | null;
        barcode: string | null;
        stock: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: string | null;
        barcode: string | null;
        stock: number;
    } | null>;
    update(id: number, updateProductDto: Partial<CreateProductDto>): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: string | null;
        barcode: string | null;
        stock: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        deletedAt: Date | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: string | null;
        barcode: string | null;
        stock: number;
    }>;
}
