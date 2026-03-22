import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateAccessDto } from './dto/validate-access.dto';
import { MembershipStatus } from '@prisma/client';

@Injectable()
export class AccessService {
    constructor(private readonly prisma: PrismaService) { }

    async validateQr(dto: ValidateAccessDto) {
        const { qrCode } = dto;

        // 1. Búsqueda de Usuario y Membresías Activas
        const user = await this.prisma.user.findUnique({
            where: { qrCode },
            include: {
                memberships: {
                    where: { status: MembershipStatus.ACTIVE },
                    include: { shift: true, plan: true },
                },
            },
        });

        // Regla 1: El usuario no existe o está inactivo
        if (!user || user.isActive === false) {
            await this.prisma.attendance.create({
                data: {
                    userId: user?.id || null,
                    isAllowed: false,
                    denialReason: 'QR Inválido o Usuario Inactivo',
                },
            });
            return { status: 'RED', message: 'Acceso Denegado' };
        }

        // Regla 2: Membresía Activa
        if (user.memberships.length === 0) {
            await this.prisma.attendance.create({
                data: {
                    userId: user.id,
                    isAllowed: false,
                    denialReason: 'Sin Membresía Activa',
                },
            });
            return { status: 'RED', message: 'Acceso Denegado' };
        }

        const membership = user.memberships[0];
        const now = new Date();

        // Regla 3: Vencimiento
        // Convertimos a medianoche para comparar solo fechas
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const expiry = new Date(membership.endDate);
        const expiryDate = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());

        if (today > expiryDate) {
            await this.prisma.attendance.create({
                data: {
                    userId: user.id,
                    isAllowed: false,
                    denialReason: 'Membresía Vencida',
                },
            });
            // Opcional: actualiza status de fondo
            await this.prisma.membership.update({
                where: { id: membership.id },
                data: { status: MembershipStatus.EXPIRED },
            });
            return { status: 'RED', message: 'Acceso Denegado' };
        }

        // Regla 4: Turno (Comparación estandarizada en UTC)
        const { shift } = membership;

        // Convertimos la hora actual a una cadena ISO y extraemos horas/minutos en UTC
        // para que coincida exactamente con cómo Prisma extrae su @db.Time
        const currentUtcHours = now.getUTCHours();
        const currentUtcMinutes = now.getUTCMinutes();
        const currentMinutes = (currentUtcHours * 60) + currentUtcMinutes;

        const startObj = new Date(shift.startTime);
        const endObj = new Date(shift.endTime);

        const startMinutes = (startObj.getUTCHours() * 60) + startObj.getUTCMinutes();
        const endMinutes = (endObj.getUTCHours() * 60) + endObj.getUTCMinutes();

        if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
            await this.prisma.attendance.create({
                data: {
                    userId: user.id,
                    isAllowed: false,
                    denialReason: 'Fuera de Turno',
                },
            });
            return { status: 'RED', message: 'Acceso Denegado' };
        }

        // Regla 5: Pase Permitido (Semanáforo Amarillo/Verde)
        await this.prisma.attendance.create({
            data: {
                userId: user.id,
                isAllowed: true,
            },
        });

        const pendingBalance = membership.pendingBalance.toNumber();

        if (pendingBalance > 0) {
            return {
                status: 'YELLOW',
                message: 'Acceso Permitido con Deuda',
                debt: pendingBalance,
                user: user.fullName,
            };
        }

        return {
            status: 'GREEN',
            message: 'Bienvenido',
            user: user.fullName,
        };
    }
}
