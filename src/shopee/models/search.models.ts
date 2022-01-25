import { ApiProperty } from "@nestjs/swagger";

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
        required: false,
    })
    keyword: string;
    
    @ApiProperty({
        type: Number,
        description: 'Limit Show Product',
        required: false,
    })
    limit: number;

    @ApiProperty({
        type: Number,
        description: 'Is Newest or Oldest',
        required: false,
    })
    newest: number;
    
    @ApiProperty({
        type: String,
        description: 'Order',
        required: false,
    })
    order: string;

    @ApiProperty({
        type: String,
        description: 'Filter by Rating',
        required: false,
    })
    ratingFilter: string;
}