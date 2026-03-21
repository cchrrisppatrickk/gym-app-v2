import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateProductDto) {
        return this.prisma.product.create({ data });
    }

    async findAll() {
        return this.prisma.product.findMany({ where: { deletedAt: null } });
    }

    async findOne(id: number) {
        return this.prisma.product.findFirst({ where: { id, deletedAt: null } });
    }

    async update(id: number, data: Partial<CreateProductDto>) {
        return this.prisma.product.update({ where: { id }, data });
    }

    async remove(id: number) {
        return this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
