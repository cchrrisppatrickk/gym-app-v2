import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('memberships')
export class MembershipsController {
    constructor(private readonly membershipsService: MembershipsService) { }

    @Post()
    async create(@Request() req: any, @Body() createMembershipDto: CreateMembershipDto) {
        return this.membershipsService.createMembership(req.user.userId, createMembershipDto);
    }
}
