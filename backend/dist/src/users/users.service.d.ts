import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(dto: CreateUserDto): Promise<{
        id: number;
        dni: string | null;
        email: string | null;
        qrCode: string | null;
        roleId: number;
        password: string | null;
        fullName: string;
        phone: string | null;
        photoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findByEmail(email: string): Promise<{
        id: number;
        dni: string | null;
        email: string | null;
        qrCode: string | null;
        roleId: number;
        password: string | null;
        fullName: string;
        phone: string | null;
        photoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
    findById(id: number): Promise<{
        id: number;
        dni: string | null;
        email: string | null;
        qrCode: string | null;
        roleId: number;
        password: string | null;
        fullName: string;
        phone: string | null;
        photoUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
}
