import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- Start Seeding ---');

    // 1. Crear Roles base
    const rolesCode = ['Admin', 'Empleado', 'Cliente'];
    const roleModels = [];

    for (const roleName of rolesCode) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
        roleModels.push(role);
        console.log(`Rol ${roleName} verificado/creado.`);
    }

    const adminRole = roleModels.find((r) => r.name === 'Admin');

    if (!adminRole) {
        throw new Error('Admin role not found after upsert');
    }

    // 2. Encriptar contraseña y crear Administrador inicial
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@gymx.com' },
        update: {},
        create: {
            email: 'admin@gymx.com',
            fullName: 'Administrador Maestro',
            password: hashedPassword,
            roleId: adminRole.id,
            isActive: true,
        },
    });

    console.log('Usuario administrador inicial verificado/creado:', adminUser.email);
    console.log('--- Seeding Finished ---');
}

main()
    .catch((e) => {
        console.error('Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
