import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenBoxDto } from './dto/open-box.dto';
import { CloseBoxDto } from './dto/close-box.dto';
import { CashRegisterStatus } from '@prisma/client';

@Injectable()
export class CashRegisterService {
    constructor(private readonly prisma: PrismaService) { }

    async getOpenBox(userId: number) {
        return this.prisma.cashRegister.findFirst({
            where: {
                userId,
                status: CashRegisterStatus.OPEN,
            },
        });
    }

    async openBox(userId: number, dto: OpenBoxDto) {
        const existingOpenBox = await this.getOpenBox(userId);

        if (existingOpenBox) {
            throw new BadRequestException('El usuario ya tiene una caja abierta. Debe cerrarla primero.');
        }

        return this.prisma.cashRegister.create({
            data: {
                userId,
                openingAmount: dto.openingAmount,
                status: CashRegisterStatus.OPEN,
            },
        });
    }

    async closeBox(userId: number, dto: CloseBoxDto) {
        const openBox = await this.getOpenBox(userId);

        if (!openBox) {
            throw new BadRequestException('No hay ninguna caja abierta para cerrar.');
        }

        const openingAmount = openBox.openingAmount;

        return this.prisma.cashRegister.update({
            where: { id: openBox.id },
            data: {
                status: CashRegisterStatus.CLOSED,
                closingAmountReal: dto.closingAmountReal,
                closingAmountSys: openingAmount,
                closingDate: new Date(),
            },
        });
    }
}
