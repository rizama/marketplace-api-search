import { HelperService } from '@app/helper';
import { Controller, Get, Query, Res, Response } from '@nestjs/common';
import {
    BranchCity,
    SearchPayloadDto,
    SearchResponseInterface,
} from './dto/search.dto';
import { JaknotService } from './jaknot.service';

@Controller('jaknot')
export class JaknotController {
    constructor(private readonly jaknotService: JaknotService) {}

    @Get('/')
    home() {
        return this.jaknotService.home();
    }

    @Get('search')
    async search(
        @Query() querySring: SearchPayloadDto,
        @Res() response,
    ): Promise<SearchResponseInterface> {

        try {
            if (
                querySring.branch &&
                !HelperService.enumValueToArray(BranchCity).includes(
                    querySring.branch,
                )
            ) {
                return response
                    .status(404)
                    .json(
                        HelperService.responseApi(
                            404,
                            `Branch ${querySring.branch} tidak ditemukan`,
                            [],
                        ),
                    );
            }

            const seaerchResult = await this.jaknotService.search(querySring);
            return response
                .status(200)
                .json(HelperService.responseApi(200, 'success', seaerchResult));
        } catch (error) {
            const message = error.message
                ? `${error.message}`
                : `Unexpected Error, ${error}`;
            return response
                .status(500)
                .json(HelperService.responseApi('error', message, []));
        }
    }
}
