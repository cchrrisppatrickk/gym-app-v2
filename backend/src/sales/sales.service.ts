import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CashRegisterService } from '../cash-register/cash-register.service';
import { CreateProductSaleDto } from './dto/create-product-sale.dto';
import { SaleType } from '@prisma/client';

@Injectable()
export class SalesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cashRegisterService: CashRegisterService,
    ) { }

    async sellProducts(employeeId: number, dto: CreateProductSaleDto) {
        // 1. Validar Caja Abierta
        const openBox = await this.cashRegisterService.getOpenBox(employeeId);
        if (!openBox) {
            throw new BadRequestException('Debe abrir caja antes de vender.');
        }

        // 2. Fetch de Productos, Validación de Stock y Cálculo de Total
        const productIds = dto.items.map((item) => item.productId);
        const productsInDb = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        let totalSaleAmount = 0;
        const itemsToProcess: { productId: number; quantity: number; unitPrice: number }[] = [];

        // Validamos cada ítem del DTO contra el stock real en DB
        for (const itemDto of dto.items) {
            const product = productsInDb.find((p) => p.id === itemDto.productId);

            if (!product) {
                throw new BadRequestException(`El producto con ID ${itemDto.productId} no existe.`);
            }

            if (product.stock < itemDto.quantity) {
                throw new BadRequestException(
                    `Stock insuficiente para el producto "${product.name}". (Disponible: ${product.stock}, Solicitado: ${itemDto.quantity})`,
                );
            }

            const unitPrice = product.price.toNumber();
            totalSaleAmount += unitPrice * itemDto.quantity;

            // Preparamos los datos para los detalles de venta
            itemsToProcess.push({
                productId: product.id,
                quantity: itemDto.quantity,
                unitPrice,
            });
        }

        // 3. Transacción Atómica de Venta
        return this.prisma.$transaction(async (tx) => {
            // Crear la Venta General
            const sale = await tx.sale.create({
                data: {
                    cashRegisterId: openBox.id,
                    type: SaleType.PRODUCT,
                    total: totalSaleAmount,
                    paymentMethod: dto.paymentMethod,
                },
            });

            // Crear Detalles de Venta y actualizar Stock individualmente
            for (const item of itemsToProcess) {
                // Registrar detalle
                await tx.saleDetail.create({
                    data: {
                        saleId: sale.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    },
                });

                // Decrementar el stock del producto
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            // Retornamos la venta con sus detalles
            return tx.sale.findUnique({
                where: { id: sale.id },
                include: { details: true },
            });
        });
    }
}
