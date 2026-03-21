import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('catalog/plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) { }

    @Post()
    create(@Body() createPlanDto: CreatePlanDto) {
        return this.plansService.create(createPlanDto);
    }

    @Get()
    findAll() {
        return this.plansService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.plansService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanDto: Partial<CreatePlanDto>) {
        return this.plansService.update(id, updatePlanDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.plansService.remove(id);
    }
}
