import { PrismaService } from '../prisma/prisma.service';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    createRole(name: string): Promise<{
        id: number;
        name: string;
    }>;
    findByName(name: string): Promise<{
        id: number;
        name: string;
    } | null>;
}
