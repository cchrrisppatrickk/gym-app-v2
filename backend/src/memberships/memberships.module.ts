import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CashRegisterModule } from '../cash-register/cash-register.module';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';

@Module({
  imports: [PrismaModule, CashRegisterModule],
  controllers: [MembershipsController],
  providers: [MembershipsService],
})
export class MembershipsModule { }
