import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(dto: CreateUserDto): Promise<{
        dni: string | null;
        email: string | null;
        password: string | null;
        fullName: string;
        phone: string | null;
        photoUrl: string | null;
        qrCode: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        roleId: number;
    }>;
    findAll(): Promise<{
        dni: string | null;
        email: string | null;
        fullName: string;
        phone: string | null;
        isActive: boolean;
        id: number;
    }[]>;
    findByEmail(email: string): Promise<{
        dni: string | null;
        email: string | null;
        password: string | null;
        fullName: string;
        phone: string | null;
        photoUrl: string | null;
        qrCode: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        roleId: number;
    } | null>;
    findById(id: number): Promise<{
        dni: string | null;
        email: string | null;
        password: string | null;
        fullName: string;
        phone: string | null;
        photoUrl: string | null;
        qrCode: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        roleId: number;
    } | null>;
}
