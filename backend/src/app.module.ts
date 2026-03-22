import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembershipsModule } from './memberships/memberships.module';
import { AccessModule } from './access/access.module';
import { CashRegisterModule } from './cash-register/cash-register.module';
import { CatalogModule } from './catalog/catalog.module';
import { RolesModule } from './roles/roles.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    MembershipsModule,
    AccessModule,
    CashRegisterModule,
    CatalogModule,
    RolesModule,
    SalesModule,
  ],
})
export class AppModule { }
