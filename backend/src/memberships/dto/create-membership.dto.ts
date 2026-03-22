export class CreateMembershipDto {
    userId!: number; // El cliente que compra
    planId!: number;
    shiftId!: number;
    paymentAmount!: number; // Cuánto está pagando en este momento
    paymentMethod!: string; // Ej: 'EFECTIVO', 'YAPE'
}
