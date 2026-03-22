import { IsString, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';

export class RegisterMemberDto {
    @IsString() firstName!: string;
    @IsString() lastName!: string;
    @IsString() dni!: string;
    @IsEmail() email!: string;
    @IsOptional() @IsString() phone?: string;
    @IsNumber() planId!: number;
    @IsNumber() shiftId!: number;
    @IsNumber() @Min(0) paymentAmount!: number;
    @IsString() paymentMethod!: string;
}
