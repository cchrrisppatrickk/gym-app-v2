import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CashRegisterService } from './cash-register.service';
import { OpenBoxDto } from './dto/open-box.dto';
import { CloseBoxDto } from './dto/close-box.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('cash-register')
export class CashRegisterController {
    constructor(private readonly cashRegisterService: CashRegisterService) { }

    @Get('current')
    async getCurrentBox(@Request() req: any) {
        return this.cashRegisterService.getOpenBox(req.user.userId);
    }

    @Post('open')
    async open(@Request() req: any, @Body() openBoxDto: OpenBoxDto) {
        return this.cashRegisterService.openBox(req.user.userId, openBoxDto);
    }

    @Post('close')
    async close(@Request() req: any, @Body() closeBoxDto: CloseBoxDto) {
        return this.cashRegisterService.closeBox(req.user.userId, closeBoxDto);
    }
}
