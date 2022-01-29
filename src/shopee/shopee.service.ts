import { Injectable, Logger } from '@nestjs/common';
import { RequestUtils, CommonUtils } from '@utils/utils';
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

            if (!requestData || !requestData.items) {
                return [];
            }

            const resultSearchProduct: ResultSearchProduct[] = [];
            for (const item of requestData.items) {
                const itemId = CommonUtils.verifyValue(item.item_basic.itemid);
                const shopId = CommonUtils.verifyValue(item.item_basic.shopid);
                const name = CommonUtils.verifyValue(item.item_basic.name);
                const images = CommonUtils.isArrayAndNotEmpty(item.item_basic.images)
                    ? item.item_basic.images.map((image) => {
                        return `https://cf.shopee.co.id/file/${image}`;
                    })
                    : [];
                // TODO: Get Harga, disc, rating, dll
                const currency = CommonUtils.verifyValue(item.item_basic.currency);
                const stock = CommonUtils.verifyValue(item.item_basic.stock);
                const price = !CommonUtils.isUndefinedOrNan(item.item_basic.price_before_discount) ? item.item_basic.price_before_discount / 100000 : 0;
                const priceBeforeDiscount = !CommonUtils.isUndefinedOrNan(item.item_basic.price) ? item.item_basic.price / 100000 : 0;
                const priceMin = !CommonUtils.isUndefinedOrNan(item.item_basic.price_min) ? item.item_basic.price_min / 100000 : 0;
                const priceMax = !CommonUtils.isUndefinedOrNan(item.item_basic.price_max) ? item.item_basic.price_max / 100000 : 0;
                const priceMinBeforeDiscount = !CommonUtils.isUndefinedOrNan(item.item_basic.price_min_before_discount) ? item.item_basic.price_min_before_discount > 0 ? item.item_basic.price_min_before_discount / 100000 : item.item_basic.price_min_before_discount : 0;
                const priceMaxBeforeDiscount = !CommonUtils.isUndefinedOrNan(item.item_basic.price_max_before_discount) ? item.item_basic.price_max_before_discount > 0 ? item.item_basic.price_max_before_discount / 100000 : item.item_basic.price_max_before_discount : 0;
                const discountPercent = !CommonUtils.isUndefinedOrNan(item.item_basic.raw_discount) ? item.item_basic.raw_discount : 0;
                const rating = !CommonUtils.isUndefinedOrNan(item.item_basic.item_rating.rating_star) ? item.item_basic.item_rating.rating_star : 0;

                resultSearchProduct.push({
                    itemId,
                    shopId,
                    name,
                    images,
                    currency,
                    stock,
                    price,
                    priceBeforeDiscount,
                    priceMin,
                    priceMax,
                    priceMinBeforeDiscount,
                    priceMaxBeforeDiscount,
                    discountPercent,
                    rating
                });
            }

            return resultSearchProduct;
        } catch (error) {
            this.logger.debug(`ERROR_SHOPEE_SEARCH: ${error}`);
            throw new Error(error.message);
        }
    }

    generateUrl(options) {
        const url = `${process.env.BASE_URL_SHOPEE}search/search_items?by=${options.sortBy}&keyword=${options.keyword}&limit=${options.limit}&newest=${options.newest}&order=${options.order}&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;

        return url;
    }
}
