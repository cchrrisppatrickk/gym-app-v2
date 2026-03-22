import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMembershipDto {
    @IsNumber() userId!: number;
    @IsNumber() planId!: number;
    @IsNumber() shiftId!: number;
    @IsOptional() @IsString() startDate?: string;
}
