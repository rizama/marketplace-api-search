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
                const images = this.generateUrlImage(item.item_basic.images);
                const currency = CommonUtils.verifyValue(item.item_basic.currency);
                const stock = CommonUtils.verifyValue(item.item_basic.stock);
                const discountPercent = !CommonUtils.isUndefinedOrNan(item.item_basic.raw_discount) ? item.item_basic.raw_discount : 0;
                const price = !CommonUtils.isUndefinedOrNan(item.item_basic.price_before_discount) ? item.item_basic.price_before_discount / 100000 : 0;
                const priceBeforeDiscount = !CommonUtils.isUndefinedOrNan(item.item_basic.price) ? item.item_basic.price / 100000 : 0;
                const priceMin = !CommonUtils.isUndefinedOrNan(item.item_basic.price_min) ? item.item_basic.price_min / 100000 : 0;
                const priceMax = !CommonUtils.isUndefinedOrNan(item.item_basic.price_max) ? item.item_basic.price_max / 100000 : 0;
                const priceMinBeforeDiscount = item.item_basic.discount ? item.item_basic.price_min_before_discount / 100000 : item.item_basic.price_min_before_discount;
                const priceMaxBeforeDiscount = item.item_basic.discount ? item.item_basic.price_max_before_discount / 100000 : item.item_basic.price_max_before_discount;
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
                    rating,
                });
            }

            return resultSearchProduct;
        } catch (error) {
            this.logger.debug(`ERROR_SHOPEE_SEARCH: ${error}`);
            throw new Error(error.message);
        }
    }

    generateUrl(options) {
        let url = `${process.env.BASE_URL_SHOPEE}search/search_items?`;

        if (options.sortBy) url += `by=${options.sortBy}&`;
        if (options.keyword) url += `keyword=${options.keyword}&`;
        if (options.limit) url += `limit=${options.limit}&`;
        if (options.newest) url += `newest=${options.newest}&`;
        if (options.order) url += `order=${options.order}&`;
        if (options.locations) url += `locations=${options.locations}&`;

        url += 'page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2';

        return url;
    }

    generateUrlImage(images) {
        return CommonUtils.isArrayAndNotEmpty(images)
            ? images.map((image) => {
                return `https://cf.shopee.co.id/file/${image}`;
            })
            : [];
    }
}
