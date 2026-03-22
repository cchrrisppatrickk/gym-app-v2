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
exports.CashRegisterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CashRegisterService = class CashRegisterService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOpenBox(userId) {
        return this.prisma.cashRegister.findFirst({
            where: {
                userId,
                status: client_1.CashRegisterStatus.OPEN,
            },
        });
    }
    async openBox(userId, dto) {
        const existingOpenBox = await this.getOpenBox(userId);
        if (existingOpenBox) {
            throw new common_1.BadRequestException('El usuario ya tiene una caja abierta. Debe cerrarla primero.');
        }
        return this.prisma.cashRegister.create({
            data: {
                userId,
                openingAmount: dto.openingAmount,
                status: client_1.CashRegisterStatus.OPEN,
            },
        });
    }
    async closeBox(userId, dto) {
        const openBox = await this.getOpenBox(userId);
        if (!openBox) {
            throw new common_1.BadRequestException('No hay ninguna caja abierta para cerrar.');
        }
        const openingAmount = openBox.openingAmount;
        return this.prisma.cashRegister.update({
            where: { id: openBox.id },
            data: {
                status: client_1.CashRegisterStatus.CLOSED,
                closingAmountReal: dto.closingAmountReal,
                closingAmountSys: openingAmount,
                closingDate: new Date(),
            },
        });
    }
};
exports.CashRegisterService = CashRegisterService;
exports.CashRegisterService = CashRegisterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CashRegisterService);
//# sourceMappingURL=cash-register.service.js.map