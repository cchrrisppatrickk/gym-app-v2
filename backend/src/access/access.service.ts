import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessService {
    constructor(private readonly prisma: PrismaService) { }

    async scanQr(userId: number) {
        // 1. Buscar usuario y su membresía activa
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { memberships: { where: { status: 'ACTIVE' }, include: { plan: true } } }
        });

        if (!user) return { status: 'DENIED', message: 'Usuario no encontrado' };
        if (user.memberships.length === 0) return { status: 'DENIED', message: 'Sin membresía activa' };

        const membership = user.memberships[0];
        const today = new Date();

        // 2. Validar Fechas
        if (today > membership.endDate) {
            return { status: 'DENIED', message: 'Membresía expirada' };
        }

        // 3. Calcular días restantes
        const daysLeft = Math.ceil((membership.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // 4. Validar Deudas (Amarillo)
        const pendingAmount = parseFloat(membership.pendingBalance as any);
        if (pendingAmount > 0) {
            return {
                status: 'WARNING',
                message: 'Acceso Permitido (Deuda Pendiente)',
                user: user.fullName,
                daysLeft,
                pendingBalance: pendingAmount
            };
        }

        // 5. Todo en orden (Verde)
        return { status: 'GRANTED', message: 'Acceso Permitido', user: user.fullName, daysLeft };
    }
}
