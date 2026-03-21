import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreatePlanDto) {
        return this.prisma.plan.create({ data });
    }

    async findAll() {
        return this.prisma.plan.findMany({ where: { deletedAt: null } });
    }

    async findOne(id: number) {
        return this.prisma.plan.findFirst({ where: { id, deletedAt: null } });
    }

    async update(id: number, data: Partial<CreatePlanDto>) {
        return this.prisma.plan.update({ where: { id }, data });
    }

    async remove(id: number) {
        return this.prisma.plan.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
