import { Controller, Post, Body } from '@nestjs/common';
import { AccessService } from './access.service';

@Controller('access')
export class AccessController {
    constructor(private readonly accessService: AccessService) { }

    @Post('scan')
    scan(@Body() body: { userId: number }) {
        return this.accessService.scanQr(body.userId);
    }
}
