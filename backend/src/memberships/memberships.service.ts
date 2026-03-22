import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CashRegisterService } from '../cash-register/cash-register.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { MembershipStatus } from '@prisma/client';

@Injectable()
export class MembershipsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cashRegisterService: CashRegisterService,
    ) { }

    async createMembership(employeeId: number, dto: CreateMembershipDto) {
        // 1. Validación de Caja
        const openBox = await this.cashRegisterService.getOpenBox(employeeId);
        if (!openBox) {
            throw new BadRequestException('Debe abrir caja antes de vender una membresía.');
        }

        // 2. Obtener Plan
        const plan = await this.prisma.plan.findUnique({
            where: { id: dto.planId },
        });
        if (!plan) {
            throw new BadRequestException('El plan seleccionado no existe.');
        }

        // 3. Cálculos de Fechas y Balance
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
        const pendingBalance = plan.price.toNumber() - dto.paymentAmount;

        // 4. Transacción Atómica
        return this.prisma.$transaction(async (tx) => {
            // Crear Membresía
            const membership = await tx.membership.create({
                data: {
                    userId: dto.userId,
                    planId: dto.planId,
                    shiftId: dto.shiftId,
                    startDate,
                    endDate,
                    status: MembershipStatus.ACTIVE,
                    totalPrice: plan.price.toNumber(),
                    pendingBalance,
                },
            });

            // Crear Pago
            await tx.payment.create({
                data: {
                    membershipId: membership.id,
                    cashRegisterId: openBox.id,
                    amount: dto.paymentAmount,
                    paymentMethod: dto.paymentMethod,
                },
            });

            return tx.membership.findUnique({
                where: { id: membership.id },
                include: { payments: true },
            });
        });
    }
}
