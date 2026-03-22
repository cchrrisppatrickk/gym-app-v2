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
const client_1 = require("@prisma/client");
let AccessService = class AccessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateQr(dto) {
        const { qrCode } = dto;
        const user = await this.prisma.user.findUnique({
            where: { qrCode },
            include: {
                memberships: {
                    where: { status: client_1.MembershipStatus.ACTIVE },
                    include: { shift: true, plan: true },
                },
            },
        });
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
            await this.prisma.membership.update({
                where: { id: membership.id },
                data: { status: client_1.MembershipStatus.EXPIRED },
            });
            return { status: 'RED', message: 'Acceso Denegado' };
        }
        const { shift } = membership;
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
};
exports.AccessService = AccessService;
exports.AccessService = AccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccessService);
//# sourceMappingURL=access.service.js.map