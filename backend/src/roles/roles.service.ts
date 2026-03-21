import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    async createRole(name: string) {
        return this.prisma.role.create({
            data: { name },
        });
    }

    async findByName(name: string) {
        return this.prisma.role.findUnique({
            where: { name },
        });
    }
}
