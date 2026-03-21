import { PrismaService } from '../prisma/prisma.service';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    createRole(name: string): Promise<any>;
    findByName(name: string): Promise<any>;
}
