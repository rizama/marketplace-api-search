import { CommonUtils } from '../../libs/utils/src';
import { Controller, Get, Query, Res } from '@nestjs/common';
import {
    SearchQueryDto,
    SearchResponseInterface,
} from './models/search.models';
import { JaknotService } from './jaknot.service';
import { BranchCity } from './enums/search.enum';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('jaknot')
@ApiTags('jakartanotebook')
export class JaknotController {
    constructor(private readonly jaknotService: JaknotService) {}

    @Get('/')
    @ApiOkResponse({
        description: 'Welcome Response'
    })
    home() {
        return 'Welcome to Jakarta Notebook Scraper';
    }

    @Get('search')
    @ApiOkResponse({
        description: 'Search Endpoint for Jakarta Notebook'
    })
    async search(
        @Query() querySring: SearchQueryDto,
        @Res() response,
    ): Promise<SearchResponseInterface> {
        try {
            if (
                querySring.branch &&
                !CommonUtils.enumValueToArray(BranchCity).includes(
                    querySring.branch,
                )
            ) {
                return response
                    .status(404)
                    .json(
                        CommonUtils.responseApi(
                            404,
                            `Branch ${querySring.branch} tidak ditemukan`,
                            [],
                        ),
                    );
            }

            const seaerchResult = await this.jaknotService.search(querySring);
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
}
