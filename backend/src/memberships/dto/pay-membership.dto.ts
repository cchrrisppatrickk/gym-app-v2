import { IsNumber, IsString, Min } from 'class-validator';

export class PayMembershipDto {
    @IsNumber() @Min(0.1) amount!: number;
    @IsString() paymentMethod!: string;
}
