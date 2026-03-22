import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SalesService } from './sales.service';
import { CreateProductSaleDto } from './dto/create-product-sale.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post('products')
    async sellProducts(@Request() req: any, @Body() dto: CreateProductSaleDto) {
        return this.salesService.sellProducts(req.user.userId, dto);
    }
}
