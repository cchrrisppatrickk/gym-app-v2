import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CashRegisterService } from '../cash-register/cash-register.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayMembershipDto } from './dto/pay-membership.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
import { MembershipStatus } from '@prisma/client';

@Injectable()
export class MembershipsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cashRegisterService: CashRegisterService,
    ) { }

    async findAll() {
        return this.prisma.membership.findMany({
            include: { user: true, plan: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async create(dto: CreateMembershipDto) {
        // 1. Obtener Plan
        const plan = await this.prisma.plan.findUnique({
            where: { id: dto.planId },
        });
        if (!plan) {
            throw new NotFoundException('El plan seleccionado no existe.');
        }

        // 2. Cálculos de Fechas y Balance
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

        // 3. Crear Membresía con 100% deuda
        return this.prisma.membership.create({
            data: {
                userId: dto.userId,
                planId: dto.planId,
                shiftId: dto.shiftId,
                startDate,
                endDate,
                status: MembershipStatus.ACTIVE,
                totalPrice: plan.price.toNumber(),
                pendingBalance: plan.price.toNumber(), // <--- El 100% se va a deuda inicial
            },
        });
    }

    async payDebt(membershipId: number, dto: PayMembershipDto) {
        // 1. Verificamos si hay caja abierta independientemente del empleado (Flujo CRM simplificado)
        const activeBox = await this.prisma.cashRegister.findFirst({ where: { status: 'OPEN' } });
        if (!activeBox) {
            throw new BadRequestException('Debe abrir la caja primero.');
        }

        // 2. Buscamos la membresía
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
        });

        if (!membership) {
            throw new NotFoundException('La membresía no existe.');
        }

        const currentDebt = membership.pendingBalance.toNumber();

        // Verificamos el monto
        if (dto.amount > currentDebt) {
            throw new BadRequestException(
                `El monto a pagar (${dto.amount}) supera la deuda actual (${currentDebt}).`,
            );
        }

        // 3. Transacción Atómica
        return this.prisma.$transaction(async (tx) => {
            // A) Registrar el pago/abono vinculado a la caja
            const payment = await tx.payment.create({
                data: {
                    membershipId,
                    cashRegisterId: activeBox.id,
                    amount: dto.amount,
                    paymentMethod: dto.paymentMethod,
                },
            });

            // B) Actualiza la membresía restando la deuda
            const updatedMembership = await tx.membership.update({
                where: { id: membershipId },
                data: {
                    pendingBalance: {
                        decrement: dto.amount,
                    },
                },
            });

            return updatedMembership;
        });
    }

    async freezeMembership(membershipId: number, dto: FreezeMembershipDto) {
        // 1. Validar Membresía y Plan
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
            include: { plan: true },
        });

        if (!membership) {
            throw new NotFoundException('Membresía no encontrada.');
        }

        if (membership.status !== MembershipStatus.ACTIVE) {
            throw new BadRequestException('Solo se pueden congelar membresías activas.');
        }

        if (!membership.plan.allowsFreeze) {
            throw new BadRequestException('El plan actual no permite congelamientos.');
        }

        // 2. Cálculo de Días de Desplazamiento
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);

        // Cálculo de diferencia en días
        const diffTime = end.getTime() - start.getTime();
        const daysFrozen = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysFrozen <= 0) {
            throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio.');
        }

        // Nueva fecha de vencimiento desplazada
        const newEndDate = new Date(membership.endDate.getTime() + daysFrozen * 24 * 60 * 60 * 1000);

        // 3. Transacción Atómica
        return this.prisma.$transaction(async (tx) => {
            // Crear registro de Congelamiento
            await tx.freeze.create({
                data: {
                    membershipId,
                    startDate: start,
                    endDate: end,
                    reason: dto.reason,
                },
            });

            // Actualizar la Membresía
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const freezeStart = new Date(start);
            freezeStart.setHours(0, 0, 0, 0);

            const updateData: any = { endDate: newEndDate };

            // Si el congelamiento empieza hoy, cambiamos el estado
            if (freezeStart.getTime() === today.getTime()) {
                updateData.status = MembershipStatus.FROZEN;
            }

            return tx.membership.update({
                where: { id: membershipId },
                data: updateData,
                include: { freezes: true },
            });
        });
    }
}
