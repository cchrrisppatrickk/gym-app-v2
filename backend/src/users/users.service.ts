import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(dto: CreateUserDto) {
        const salt = 10;
        let hashedPassword = null;

        if (dto.password) {
            hashedPassword = await bcrypt.hash(dto.password, salt);
        }

        return this.prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
}
