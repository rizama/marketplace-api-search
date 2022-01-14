import { ApiProperty } from '@nestjs/swagger';
import { BranchCity } from '../enums/search.enum';

export class SearchQueryDto {
    @ApiProperty({
        type: String,
        description: 'Keyword Search',
        required: false,
    })
    query: string;

    @ApiProperty({
        type: String,
        description: 'Branch in City',
        required: false,
        example: 'bandung',
        enumName: 'Available Branch',
        enum: [
            'bandung',
            'jabodetabek',
            'surabaya',
            'yogyakarta',
            'semarang',
            'medan',
        ],
    })
    branch: BranchCity;

    @ApiProperty({
        type: Number,
        description: 'Limit products result',
        required: false,
        default: 40,
        example: 40,
        enumName: 'Available Limit Products',
        enum: [40, 60, 90],
    })
    show: number;

    @ApiProperty({
        type: String,
        description: 'Sorting products',
        required: false,
        default: 'match',
        example: 'match',
        enumName: 'Available Sorting Type',
        enum: ['name', 'match', 'lowprice', 'highprice', 'newitem'],
    })
    sort: string;

    @ApiProperty({
        type: String,
        description: 'Show only Available Stock by Branch',
        required: false,
        example: 'nofilter',
        enumName: 'Available Filter Stock',
        enum: [
            'nofilter',
            'availablestock',
            'onlinecod',
            'bandung',
            'jakartabarat',
            'jakartautara',
            'cikpua',
            'tangerang',
            'semarang',
            'surabayatimur',
            'surabayabarat',
            'medan',
            'yogyakarta',
        ],
    })
    ready: string;
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
    slug: string;
    image: string;
    discountPercent: number;
    rating: number;
    description: string;
    priceReal: number;
    priceFinal: number;
    branchs: string[];
}
