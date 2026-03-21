export class CreateProductDto {
    name: string;
    category?: string;
    price: number;
    barcode?: string;
    stock?: number;
}
