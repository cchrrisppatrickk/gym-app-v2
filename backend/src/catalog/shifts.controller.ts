import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('catalog/shifts')
export class ShiftsController {
    constructor(private readonly shiftsService: ShiftsService) { }

    @Post()
    create(@Body() createShiftDto: CreateShiftDto) {
        return this.shiftsService.create(createShiftDto);
    }

    @Get()
    findAll() {
        return this.shiftsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.shiftsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateShiftDto: Partial<CreateShiftDto>) {
        return this.shiftsService.update(id, updateShiftDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.shiftsService.remove(id);
    }
}
