import { CommonUtils } from '../../libs/utils/src';
import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import {
    SearchQueryDto,
    SearchResponseInterface,
} from './models/search.models';
import { JaknotService } from './jaknot.service';
import { BranchCity } from './enums/search.enum';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    DetailParamDto,
    DetailQueryStringDto,
    DetailResponseInterface,
} from './models/detail-product.models';

@Controller('jaknot')
@ApiTags('jakartanotebook')
export class JaknotController {
    constructor(private readonly jaknotService: JaknotService) {}

    @Get('/')
    @ApiOkResponse({
        description: 'Welcome Response',
    })
    home() {
        return 'Welcome to Jakarta Notebook Scraper';
    }

    @Get('v1/search')
    @ApiOkResponse({
        description: 'Search Endpoint for Jakarta Notebook',
    })
    async search(
        @Query() queryString: SearchQueryDto,
        @Res() response,
    ): Promise<SearchResponseInterface> {
        try {
            if (
                queryString.branch &&
                !CommonUtils.enumValueToArray(BranchCity).includes(
                    queryString.branch,
                )
            ) {
                return response
                    .status(404)
                    .json(
                        CommonUtils.responseApi(
                            404,
                            `Branch ${queryString.branch} tidak ditemukan`,
                            [],
                        ),
                    );
            }

            const seaerchResult = await this.jaknotService.searchJaknot(queryString);
            return response
                .status(200)
                .json(CommonUtils.responseApi(200, 'success', seaerchResult));
        } catch (error) {
            const message = error.message
                ? `${error.message}`
                : `Unexpected Error, ${error}`;
            return response
                .status(500)
                .json(CommonUtils.responseApi('error', message, []));
        }
    }

    @Get('v1/detail/:slug')
    async detail(
        @Param() params: DetailParamDto,
        @Res() response,
        @Query() queryString: DetailQueryStringDto,
    ): Promise<DetailResponseInterface> {
        try {
            if (
                queryString.branch &&
                !CommonUtils.enumValueToArray(BranchCity).includes(
                    queryString.branch,
                )
            ) {
                return response
                    .status(404)
                    .json(
                        CommonUtils.responseApi(
                            404,
                            `Branch ${queryString.branch} tidak ditemukan`,
                            [],
                        ),
                    );
            }

            const detailResult = await this.jaknotService.detailJaknot(params, queryString);
            return response
                .status(200)
                .json(CommonUtils.responseApi(200, 'success', detailResult));
        } catch (error) {}
    }
}
