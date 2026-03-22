import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProductDto): Promise<{
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
    update(id: number, data: Partial<CreateProductDto>): Promise<{
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
