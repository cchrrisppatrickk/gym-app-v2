export class SaleItemDto {
    productId!: number;
    quantity!: number;
}

export class CreateProductSaleDto {
    items!: SaleItemDto[];
    paymentMethod!: string;
}
