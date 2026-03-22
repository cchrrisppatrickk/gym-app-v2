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
exports.AccessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccessService = class AccessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async scanQr(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { memberships: { where: { status: 'ACTIVE' }, include: { plan: true } } }
        });
        if (!user)
            return { status: 'DENIED', message: 'Usuario no encontrado' };
        if (user.memberships.length === 0)
            return { status: 'DENIED', message: 'Sin membresía activa' };
        const membership = user.memberships[0];
        const today = new Date();
        if (today > membership.endDate) {
            return { status: 'DENIED', message: 'Membresía expirada' };
        }
        const daysLeft = Math.ceil((membership.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const pendingAmount = parseFloat(membership.pendingBalance);
        if (pendingAmount > 0) {
            return {
                status: 'WARNING',
                message: 'Acceso Permitido (Deuda Pendiente)',
                user: user.fullName,
                daysLeft,
                pendingBalance: pendingAmount
            };
        }
        return { status: 'GRANTED', message: 'Acceso Permitido', user: user.fullName, daysLeft };
    }
};
exports.AccessService = AccessService;
exports.AccessService = AccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccessService);
//# sourceMappingURL=access.service.js.map