import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: number;
        dni: string | null;
        email: string | null;
        fullName: string;
        phone: string | null;
        isActive: boolean;
    }[]>;
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        roleId: number;
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
    }>;
}
