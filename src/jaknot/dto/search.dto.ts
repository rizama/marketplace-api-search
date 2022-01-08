export class SearchPayloadDto {
    query: string;
    branch: BranchCity;
}

export interface SearchResponseInterface {
    status?: string;
    data?: ResultSearchProduct[];
    message?: string;
}

export interface ResultSearchProduct {
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

export enum BranchCity {
    Jabodetabek = 'jabodetabek',
    Bandung = 'bandung',
    Semarang = 'semarang',
    Surabaya = 'surabaya',
    Medan = 'medan',
    Yogyakarta = 'yogyakarta',
}