"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cash_register_service_1 = require("../cash-register/cash-register.service");
const client_1 = require("@prisma/client");
let MembershipsService = class MembershipsService {
    prisma;
    cashRegisterService;
    constructor(prisma, cashRegisterService) {
        this.prisma = prisma;
        this.cashRegisterService = cashRegisterService;
    }
    async findAll() {
        return this.prisma.membership.findMany({
            include: { user: true, plan: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(dto) {
        const plan = await this.prisma.plan.findUnique({
            where: { id: dto.planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException('El plan seleccionado no existe.');
        }
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
        return this.prisma.membership.create({
            data: {
                userId: dto.userId,
                planId: dto.planId,
                shiftId: dto.shiftId,
                startDate,
                endDate,
                status: client_1.MembershipStatus.ACTIVE,
                totalPrice: plan.price.toNumber(),
                pendingBalance: plan.price.toNumber(),
            },
        });
    }
    async payDebt(membershipId, dto) {
        const activeBox = await this.prisma.cashRegister.findFirst({ where: { status: 'OPEN' } });
        if (!activeBox) {
            throw new common_1.BadRequestException('Debe abrir la caja primero.');
        }
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
        });
        if (!membership) {
            throw new common_1.NotFoundException('La membresía no existe.');
        }
        const currentDebt = membership.pendingBalance.toNumber();
        if (dto.amount > currentDebt) {
            throw new common_1.BadRequestException(`El monto a pagar (${dto.amount}) supera la deuda actual (${currentDebt}).`);
        }
        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    membershipId,
                    cashRegisterId: activeBox.id,
                    amount: dto.amount,
                    paymentMethod: dto.paymentMethod,
                },
            });
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
    async freezeMembership(membershipId, dto) {
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
            include: { plan: true },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membresía no encontrada.');
        }
        if (membership.status !== client_1.MembershipStatus.ACTIVE) {
            throw new common_1.BadRequestException('Solo se pueden congelar membresías activas.');
        }
        if (!membership.plan.allowsFreeze) {
            throw new common_1.BadRequestException('El plan actual no permite congelamientos.');
        }
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        const diffTime = end.getTime() - start.getTime();
        const daysFrozen = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (daysFrozen <= 0) {
            throw new common_1.BadRequestException('La fecha de fin debe ser posterior a la de inicio.');
        }
        const newEndDate = new Date(membership.endDate.getTime() + daysFrozen * 24 * 60 * 60 * 1000);
        return this.prisma.$transaction(async (tx) => {
            await tx.freeze.create({
                data: {
                    membershipId,
                    startDate: start,
                    endDate: end,
                    reason: dto.reason,
                },
            });
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const freezeStart = new Date(start);
            freezeStart.setHours(0, 0, 0, 0);
            const updateData = { endDate: newEndDate };
            if (freezeStart.getTime() === today.getTime()) {
                updateData.status = client_1.MembershipStatus.FROZEN;
            }
            return tx.membership.update({
                where: { id: membershipId },
                data: updateData,
                include: { freezes: true },
            });
        });
    }
};
exports.MembershipsService = MembershipsService;
exports.MembershipsService = MembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cash_register_service_1.CashRegisterService])
], MembershipsService);
//# sourceMappingURL=memberships.service.js.map