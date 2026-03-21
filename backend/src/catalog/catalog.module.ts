import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PlansController } from './plans.controller';
import { ShiftsController } from './shifts.controller';
import { ProductsController } from './products.controller';
import { PlansService } from './plans.service';
import { ShiftsService } from './shifts.service';
import { ProductsService } from './products.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlansController, ShiftsController, ProductsController],
  providers: [PlansService, ShiftsService, ProductsService],
})
export class CatalogModule { }
