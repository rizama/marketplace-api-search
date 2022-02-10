import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommonUtils } from '@utils/utils';
import { SearchQueryShopeeDto } from './models/search.models';
import { ShopeeService } from './shopee.service';

@Controller('shopee')
@ApiTags('shopee')
export class ShopeeController {
    constructor(private readonly shopeetService: ShopeeService) {}

    @Get('v1/search')
    @ApiOkResponse({
        description: 'Search Endpoint for Shopee',
    })
    async search(@Query() queryString: SearchQueryShopeeDto, @Res() response) {
        try {
            const seaerchResult = await this.shopeetService.searchShopee(queryString);
            return response.status(200).json(CommonUtils.responseApi(200, 'success', seaerchResult));
        } catch (error) {
            const message = error.message ? `${error.message}` : `Unexpected Error, ${error}`;
            return response.status(500).json(CommonUtils.responseApi('error', message, []));
        }
    }

    @Get('v1/detail')
    @ApiOkResponse({
        description: 'Detail Endpoint for Shopee',
    })
    async detail(@Res() response) {
        try {
        } catch (error) {
            const message = error.message ? `${error.message}` : `Unexpected Error, ${error}`;
            return response.status(500).json(CommonUtils.responseApi('error', message, []));
        }
    }
}
