export declare class SaleItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateProductSaleDto {
    items: SaleItemDto[];
    paymentMethod: string;
}
