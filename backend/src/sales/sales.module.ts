import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CashRegisterModule } from '../cash-register/cash-register.module';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  imports: [PrismaModule, CashRegisterModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule { }
