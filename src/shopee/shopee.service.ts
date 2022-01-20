import { Injectable, Logger } from '@nestjs/common';
import { RequestUtils } from '@utils/utils';
import { SearchQueryShopeeDto } from './models/search.models';

@Injectable()
export class ShopeeService {
    private readonly logger = new Logger('JaknotService');
    private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36';


    async searchShopee(searchQueryShopeeDto: SearchQueryShopeeDto) {
        try {
            const { sortBy, keyword } = searchQueryShopeeDto;

            const url = `${process.env.BASE_URL_SHOPEE}search/search_items?by=${sortBy}&keyword=${keyword}&limit=60&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;
            const headers = {
                Accept: 'text/html,*/*',
                'User-Agent': this.USER_AGENT
            };

            const requestData = await RequestUtils.getRequest(url, headers);

            return requestData;

        } catch (error) {
            this.logger.debug('Error Service Search: ', error);
            throw new Error(error.message);
        }
    }
}
