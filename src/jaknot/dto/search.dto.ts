export class SearchPayloadDto {
    query: string;
    branch: string;
}

export interface SearchResponseInterface {
    sku: string;
    name: string;
    detail: string;
    image: string;
    discountPercent: number;
    rating: number;
    description: string;
    priceReal: number;
    priceFinal: number;
    branchs: string[];
}
