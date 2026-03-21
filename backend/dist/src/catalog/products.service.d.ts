import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProductDto): Promise<{
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
    update(id: number, data: Partial<CreateProductDto>): Promise<{
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
