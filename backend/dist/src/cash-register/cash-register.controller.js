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
exports.CashRegisterController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const cash_register_service_1 = require("./cash-register.service");
const open_box_dto_1 = require("./dto/open-box.dto");
const close_box_dto_1 = require("./dto/close-box.dto");
let CashRegisterController = class CashRegisterController {
    cashRegisterService;
    constructor(cashRegisterService) {
        this.cashRegisterService = cashRegisterService;
    }
    async getCurrentBox(req) {
        return this.cashRegisterService.getOpenBox(req.user.userId);
    }
    async open(req, openBoxDto) {
        return this.cashRegisterService.openBox(req.user.userId, openBoxDto);
    }
    async close(req, closeBoxDto) {
        return this.cashRegisterService.closeBox(req.user.userId, closeBoxDto);
    }
};
exports.CashRegisterController = CashRegisterController;
__decorate([
    (0, common_1.Get)('current'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CashRegisterController.prototype, "getCurrentBox", null);
__decorate([
    (0, common_1.Post)('open'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, open_box_dto_1.OpenBoxDto]),
    __metadata("design:returntype", Promise)
], CashRegisterController.prototype, "open", null);
__decorate([
    (0, common_1.Post)('close'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, close_box_dto_1.CloseBoxDto]),
    __metadata("design:returntype", Promise)
], CashRegisterController.prototype, "close", null);
exports.CashRegisterController = CashRegisterController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('cash-register'),
    __metadata("design:paramtypes", [cash_register_service_1.CashRegisterService])
], CashRegisterController);
//# sourceMappingURL=cash-register.controller.js.map