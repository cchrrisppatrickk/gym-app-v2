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
    async createMembership(employeeId, dto) {
        const openBox = await this.cashRegisterService.getOpenBox(employeeId);
        if (!openBox) {
            throw new common_1.BadRequestException('Debe abrir caja antes de vender una membresía.');
        }
        const plan = await this.prisma.plan.findUnique({
            where: { id: dto.planId },
        });
        if (!plan) {
            throw new common_1.BadRequestException('El plan seleccionado no existe.');
        }
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
        const pendingBalance = plan.price.toNumber() - dto.paymentAmount;
        return this.prisma.$transaction(async (tx) => {
            const membership = await tx.membership.create({
                data: {
                    userId: dto.userId,
                    planId: dto.planId,
                    shiftId: dto.shiftId,
                    startDate,
                    endDate,
                    status: client_1.MembershipStatus.ACTIVE,
                    totalPrice: plan.price.toNumber(),
                    pendingBalance,
                },
            });
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
    async payDebt(employeeId, membershipId, dto) {
        const openBox = await this.cashRegisterService.getOpenBox(employeeId);
        if (!openBox) {
            throw new common_1.BadRequestException('Debe abrir caja antes de cobrar una deuda.');
        }
        const membership = await this.prisma.membership.findUnique({
            where: { id: membershipId },
        });
        if (!membership) {
            throw new common_1.NotFoundException('La membresía no existe.');
        }
        const currentDebt = membership.pendingBalance.toNumber();
        if (currentDebt <= 0) {
            throw new common_1.BadRequestException('Esta membresía no tiene deudas pendientes.');
        }
        if (dto.amount > currentDebt) {
            throw new common_1.BadRequestException(`El monto a pagar ($${dto.amount}) supera la deuda actual ($${currentDebt}).`);
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedMembership = await tx.membership.update({
                where: { id: membershipId },
                data: {
                    pendingBalance: {
                        decrement: dto.amount,
                    },
                },
            });
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
};
exports.MembershipsService = MembershipsService;
exports.MembershipsService = MembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cash_register_service_1.CashRegisterService])
], MembershipsService);
//# sourceMappingURL=memberships.service.js.map