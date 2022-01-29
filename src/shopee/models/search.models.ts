import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryShopeeDto {
    @ApiProperty({
        type: String,
        description: 'Sort Product',
        required: false,
    })
    sortBy: string;

    @ApiProperty({
        type: String,
        description: 'Keyword Search',
        required: true,
    })
    keyword: string;

    @ApiProperty({
        type: Number,
        description: 'Limit Show Product',
        required: false,
        example: 60,
        default: 60,
    })
    limit: number;

    @ApiProperty({
        type: Number,
        description: 'For Skip Result',
        required: false,
        example: 0,
        default: 0,
    })
    newest: number;

    @ApiProperty({
        type: String,
        description: 'Order Product',
        required: false,
        example: 'asc',
        enumName: 'Order Product',
        enum: ['asc', 'desc'],
    })
    order: string;

    @ApiProperty({
        type: Number,
        description: 'Filter by Rating',
        required: false,
        example: 5,
        enumName: 'Filter by Rating',
        enum: [1, 2, 3, 4, 5],
    })
    ratingFilter: string;
}

export interface SearchResponseInterface {
    status?: string;
    data?: ResultSearchProduct[];
    message?: string;
}

export interface ResultSearchProduct {
    itemId: number;
    shopId: number;
    name: string;
    images: string[];
    currency: string;
    stock: number;
    price: number;
    priceBeforeDiscount: number;
    priceMin: number;
    priceMax: number;
    priceMinBeforeDiscount: number;
    priceMaxBeforeDiscount: number;
    discountPercent: number;
    rating: number;
}
