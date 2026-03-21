import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class ShiftsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateShiftDto) {
        return this.prisma.shift.create({ data });
    }

    async findAll() {
        return this.prisma.shift.findMany({ where: { deletedAt: null } });
    }

    async findOne(id: number) {
        return this.prisma.shift.findFirst({ where: { id, deletedAt: null } });
    }

    async update(id: number, data: Partial<CreateShiftDto>) {
        return this.prisma.shift.update({ where: { id }, data });
    }

    async remove(id: number) {
        return this.prisma.shift.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
