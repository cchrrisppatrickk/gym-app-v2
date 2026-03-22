"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cash_register_service_1 = require("../cash-register/cash-register.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let SalesService = class SalesService {
    prisma;
    cashRegisterService;
    constructor(prisma, cashRegisterService) {
        this.prisma = prisma;
        this.cashRegisterService = cashRegisterService;
    }
    async sellProducts(employeeId, dto) {
        const openBox = await this.cashRegisterService.getOpenBox(employeeId);
        if (!openBox) {
            throw new common_1.BadRequestException('Debe abrir caja antes de vender.');
        }
        const productIds = dto.items.map((item) => item.productId);
        const productsInDb = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        let totalSaleAmount = 0;
        const itemsToProcess = [];
        for (const itemDto of dto.items) {
            const product = productsInDb.find((p) => p.id === itemDto.productId);
            if (!product) {
                throw new common_1.BadRequestException(`El producto con ID ${itemDto.productId} no existe.`);
            }
            if (product.stock < itemDto.quantity) {
                throw new common_1.BadRequestException(`Stock insuficiente para el producto "${product.name}". (Disponible: ${product.stock}, Solicitado: ${itemDto.quantity})`);
            }
            const unitPrice = product.price.toNumber();
            totalSaleAmount += unitPrice * itemDto.quantity;
            itemsToProcess.push({
                productId: product.id,
                quantity: itemDto.quantity,
                unitPrice,
            });
        }
        return this.prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    cashRegisterId: openBox.id,
                    type: client_1.SaleType.PRODUCT,
                    total: totalSaleAmount,
                    paymentMethod: dto.paymentMethod,
                },
            });
            for (const item of itemsToProcess) {
                await tx.saleDetail.create({
                    data: {
                        saleId: sale.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    },
                });
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            return tx.sale.findUnique({
                where: { id: sale.id },
                include: { details: true },
            });
        });
    }
    async sellDayPass(employeeId, dto) {
        const openBox = await this.cashRegisterService.getOpenBox(employeeId);
        if (!openBox) {
            throw new common_1.BadRequestException('Debe abrir caja antes de vender.');
        }
        const qrCode = crypto.randomUUID();
        const validDate = new Date();
        return this.prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    cashRegisterId: openBox.id,
                    type: client_1.SaleType.DAY_PASS,
                    total: dto.price,
                    paymentMethod: dto.paymentMethod,
                },
            });
            const dayPass = await tx.dayPass.create({
                data: {
                    saleId: sale.id,
                    code: qrCode,
                    buyerName: dto.buyerName,
                    dni: dto.dni,
                    validDate: validDate,
                },
            });
            return {
                message: 'Venta de Pase Diario exitosa',
                sale,
                qrCode: dayPass.code,
            };
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cash_register_service_1.CashRegisterService])
], SalesService);
//# sourceMappingURL=sales.service.js.map