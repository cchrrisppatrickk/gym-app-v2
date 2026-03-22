import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessService } from './access.service';
import { ValidateAccessDto } from './dto/validate-access.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('access')
export class AccessController {
    constructor(private readonly accessService: AccessService) { }

    @Post('validate')
    async validate(@Body() validateAccessDto: ValidateAccessDto) {
        return this.accessService.validateQr(validateAccessDto);
    }
}
