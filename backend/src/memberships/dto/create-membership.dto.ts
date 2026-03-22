import { IsNumber } from 'class-validator';

export class CreateMembershipDto {
    @IsNumber() userId!: number;
    @IsNumber() planId!: number;
    @IsNumber() shiftId!: number;
}
