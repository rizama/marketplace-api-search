import { Injectable, Logger } from '@nestjs/common';
import { RequestUtils } from '@utils/utils';
import { ResultSearchProduct, SearchQueryShopeeDto } from './models/search.models';

@Injectable()
export class ShopeeService {
    private readonly logger = new Logger('ShopeeService');
    private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36';

    async searchShopee(searchQueryShopeeDto: SearchQueryShopeeDto): Promise<ResultSearchProduct[]> {
        try {
            const url = this.generateUrl(searchQueryShopeeDto);
            const headers = {
                Accept: 'text/html,*/*',
                'User-Agent': this.USER_AGENT,
            };

            const requestData = await RequestUtils.getRequest(url, headers);

            if (!requestData && !requestData.items) {
                return [];
            }

            const resultSearchProduct: ResultSearchProduct[] = [];
            for (const item of requestData.items) {
                const itemId = item.item_basic.itemid;
                const shopId = item.item_basic.shopid;
                const name = item.item_basic.name;
                const images = item.item_basic.images.map((image) => {
                    return `https://cf.shopee.co.id/file/${image}`;
                });

                resultSearchProduct.push({
                    itemId,
                    shopId,
                    name,
                    images,
                });
            }

            return resultSearchProduct;
        } catch (error) {
            this.logger.debug('Error Service Search: ', error);
            throw new Error(error.message);
        }
    }

    generateUrl(options) {
        const url = `${process.env.BASE_URL_SHOPEE}search/search_items?by=${options.sortBy}&keyword=${options.keyword}&limit=${options.limit}&newest=${options.newest}&order=${options.order}&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;

        return url;
    }
}
