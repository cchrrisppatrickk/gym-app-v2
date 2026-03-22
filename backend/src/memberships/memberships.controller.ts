import { Body, Controller, Post, Request, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { PayDebtDto } from './dto/pay-debt.dto';
import { FreezeMembershipDto } from './dto/freeze-membership.dto';
import { RegisterMemberDto } from './dto/register-member.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('memberships')
export class MembershipsController {
    constructor(private readonly membershipsService: MembershipsService) { }

    @Post('register')
    registerNewMember(@Body() dto: RegisterMemberDto) {
        return this.membershipsService.registerNewMember(dto);
    }

    @Post()
    async create(@Request() req: any, @Body() createMembershipDto: CreateMembershipDto) {
        return this.membershipsService.createMembership(req.user.userId, createMembershipDto);
    }

    @Post(':id/pay')
    async payDebt(
        @Param('id', ParseIntPipe) id: number,
        @Body() payDebtDto: PayDebtDto,
        @Request() req: any,
    ) {
        return this.membershipsService.payDebt(req.user.userId, id, payDebtDto);
    }

    @Post(':id/freeze')
    async freeze(
        @Param('id', ParseIntPipe) id: number,
        @Body() freezeMembershipDto: FreezeMembershipDto,
    ) {
        return this.membershipsService.freezeMembership(id, freezeMembershipDto);
    }
}
