import { ApiProperty } from "@nestjs/swagger";

export class DetailParamDto {
    @ApiProperty({
        type: String,
        description: 'Product Slug',
        required: true,
    })
    slug: string;
}