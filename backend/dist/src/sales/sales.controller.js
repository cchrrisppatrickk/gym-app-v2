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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const sales_service_1 = require("./sales.service");
const create_product_sale_dto_1 = require("./dto/create-product-sale.dto");
const create_day_pass_dto_1 = require("./dto/create-day-pass.dto");
let SalesController = class SalesController {
    salesService;
    constructor(salesService) {
        this.salesService = salesService;
    }
    async sellProducts(req, dto) {
        return this.salesService.sellProducts(req.user.userId, dto);
    }
    async sellDayPass(req, dto) {
        return this.salesService.sellDayPass(req.user.userId, dto);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_sale_dto_1.CreateProductSaleDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "sellProducts", null);
__decorate([
    (0, common_1.Post)('day-pass'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_day_pass_dto_1.CreateDayPassDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "sellDayPass", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map