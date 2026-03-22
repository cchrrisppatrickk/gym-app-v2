"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const memberships_module_1 = require("./memberships/memberships.module");
const access_module_1 = require("./access/access.module");
const cash_register_module_1 = require("./cash-register/cash-register.module");
const catalog_module_1 = require("./catalog/catalog.module");
const roles_module_1 = require("./roles/roles.module");
const sales_module_1 = require("./sales/sales.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            memberships_module_1.MembershipsModule,
            access_module_1.AccessModule,
            cash_register_module_1.CashRegisterModule,
            catalog_module_1.CatalogModule,
            roles_module_1.RolesModule,
            sales_module_1.SalesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map