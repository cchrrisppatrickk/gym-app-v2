import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createUser(dto: CreateUserDto) {
        // Validation: Verify if the DNI or Email already exists
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: dto.email },
                    { dni: dto.dni },
                ],
            },
        });

        if (existingUser) {
            throw new BadRequestException('El DNI o Email ya está registrado.');
        }

        const salt = 10;
        let hashedPassword = null;

        if (dto.password) {
            hashedPassword = await bcrypt.hash(dto.password, salt);
        }

        return this.prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword,
                roleId: dto.roleId || 3, // Default role for members is 3
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
            where: { roleId: 3 },
            select: {
                id: true,
                fullName: true,
                dni: true,
                email: true,
                phone: true,
                isActive: true,
            }
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
