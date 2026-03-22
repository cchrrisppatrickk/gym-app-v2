import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CashRegisterService } from '../cash-register/cash-register.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayDebtDto } from './dto/pay-debt.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
import { RegisterMemberDto } from './dto/register-member.dto';
import { MembershipStatus } from '@prisma/client';

@Injectable()
export class MembershipsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cashRegisterService: CashRegisterService,
    ) { }

    async registerNewMember(dto: RegisterMemberDto) {
        // 1. Verificar si hay caja abierta
        const activeBox = await this.prisma.cashRegister.findFirst({ where: { status: 'OPEN' } });
        if (!activeBox && dto.paymentAmount > 0) {
            throw new BadRequestException('Debe abrir la caja antes de registrar un pago.');
        }

        // 2. Verificar si el DNI o Email ya existen
        const existingUser = await this.prisma.user.findFirst({
            where: { OR: [{ email: dto.email }, { dni: dto.dni }] },
        });
        if (existingUser) {
            throw new BadRequestException('El DNI o Email ya está registrado.');
        }

        // 3. Obtener el Plan
        const plan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
        if (!plan) throw new NotFoundException('Plan no encontrado');

        // 4. Cálculos matemáticos
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);
        const pendingBalance = plan.price.toNumber() - dto.paymentAmount;

        // 5. Transacción Atómica
        return this.prisma.$transaction(async (tx) => {
            // A. Crear Usuario (Rol 3 = Socio)
            const user = await tx.user.create({
                data: {
                    fullName: `${dto.firstName} ${dto.lastName}`, dni: dto.dni,
                    email: dto.email, phone: dto.phone,
                    password: 'password_generico_cambiar', roleId: 3,
                },
            });

            // B. Crear Membresía usando el ID del nuevo usuario
            const membership = await tx.membership.create({
                data: {
                    userId: user.id, planId: dto.planId, shiftId: dto.shiftId,
                    startDate, endDate, status: 'ACTIVE',
                    totalPrice: plan.price.toNumber(), pendingBalance,
                },
            });

            // C. Registrar Pago si hay monto inicial
            if (dto.paymentAmount > 0 && activeBox) {
                await tx.payment.create({
                    data: {
                        membershipId: membership.id, cashRegisterId: activeBox.id,
                        amount: dto.paymentAmount, paymentMethod: dto.paymentMethod,
                    },
                });
            }

            return membership;
        });
    }

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

    async payDebt(employeeId: number, membershipId: number, dto: PayDebtDto) {
        // 1. Validar Caja Abierta
        const openBox = await this.cashRegisterService.getOpenBox(employeeId);
        if (!openBox) {
            throw new BadRequestException('Debe abrir caja antes de cobrar una deuda.');
        }

        // 2. Validar Membresía y Deuda
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
        });

        if (!membership) {
            throw new NotFoundException('La membresía no existe.');
        }

        const currentDebt = membership.pendingBalance.toNumber();

        if (currentDebt <= 0) {
            throw new BadRequestException('Esta membresía no tiene deudas pendientes.');
        }

        // Validación Matemática: El pago no puede superar la deuda
        if (dto.amount > currentDebt) {
            throw new BadRequestException(
                `El monto a pagar ($${dto.amount}) supera la deuda actual ($${currentDebt}).`,
            );
        }

        // 3. Transacción Atómica
        return this.prisma.$transaction(async (tx) => {
            // Amortizar la deuda
            const updatedMembership = await tx.membership.update({
                where: { id: membershipId },
                data: {
                    pendingBalance: {
                        decrement: dto.amount,
                    },
                },
            });

            // Registrar el pago/abono vinculado a la caja
            const payment = await tx.payment.create({
                data: {
                    membershipId,
                    cashRegisterId: openBox.id,
                    amount: dto.amount,
                    paymentMethod: dto.paymentMethod,
                    notes: 'Abono de deuda',
                },
            });

            return {
                message: 'Abono de deuda registrado con éxito',
                payment,
                newPendingBalance: updatedMembership.pendingBalance.toNumber(),
            };
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
