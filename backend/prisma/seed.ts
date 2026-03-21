import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({});

async function main() {
    // 1. Crear Roles base
    const roleAdmin = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: { name: 'Admin' },
    });

    const roleEmpleado = await prisma.role.upsert({
        where: { name: 'Empleado' },
        update: {},
        create: { name: 'Empleado' },
    });

    const roleCliente = await prisma.role.upsert({
        where: { name: 'Cliente' },
        update: {},
        create: { name: 'Cliente' },
    });

    // 2. Crear Usuario Admin Maestro
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@gymx.com' },
        update: {},
        create: {
            email: 'admin@gymx.com',
            fullName: 'Administrador Maestro',
            password: hashedPassword,
            roleId: roleAdmin.id,
        },
    });

    console.log('🌱 Base de datos inicializada con éxito.');
    console.log({ admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
