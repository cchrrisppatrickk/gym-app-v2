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
exports.MembershipsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const memberships_service_1 = require("./memberships.service");
const create_membership_dto_1 = require("./dto/create-membership.dto");
const pay_debt_dto_1 = require("./dto/pay-debt.dto");
const freeze_membership_dto_1 = require("./dto/freeze-membership.dto");
let MembershipsController = class MembershipsController {
    membershipsService;
    constructor(membershipsService) {
        this.membershipsService = membershipsService;
    }
    findAll() {
        return this.membershipsService.findAll();
    }
    create(createMembershipDto) {
        return this.membershipsService.create(createMembershipDto);
    }
    async payDebt(id, payDebtDto, req) {
        return this.membershipsService.payDebt(req.user.userId, id, payDebtDto);
    }
    async freeze(id, freezeMembershipDto) {
        return this.membershipsService.freezeMembership(id, freezeMembershipDto);
    }
};
exports.MembershipsController = MembershipsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_membership_dto_1.CreateMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pay_debt_dto_1.PayDebtDto, Object]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "payDebt", null);
__decorate([
    (0, common_1.Post)(':id/freeze'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, freeze_membership_dto_1.FreezeMembershipDto]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "freeze", null);
exports.MembershipsController = MembershipsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('memberships'),
    __metadata("design:paramtypes", [memberships_service_1.MembershipsService])
], MembershipsController);
//# sourceMappingURL=memberships.controller.js.map