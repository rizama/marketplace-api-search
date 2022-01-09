import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Filter } from './enums/search.enum';
import {
    SearchQueryDto,
    ResultSearchProduct,
} from './models/search.models';

@Injectable()
export class JaknotService {

    private readonly logger = new Logger('JaknotService');
    private readonly USER_AGENT =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0';

    async search(
        querySring: SearchQueryDto,
    ): Promise<ResultSearchProduct[]> {
        try {
            const { query, branch, show, sort, ready } = querySring;

            const str2 = ready.charAt(0).toUpperCase() + ready.slice(1);
            const filterByAvailabaleInBranch = Filter[str2];
            console.log(filterByAvailabaleInBranch)

            const url = `${process.env.BASE_URL_JAKNOT}search?key=${query}&show=${show}&sort=${sort}&ready=${filterByAvailabaleInBranch}`;

            const { data } = await axios.get(url, {
                headers: {
                    Accept: 'text/html,*/*',
                    'User-Agent': this.USER_AGENT,
                    cookie: `selectedGroupBranch=${branch};`,
                },
            });
            const $ = cheerio.load(data);

            const resultSearch = $('.product-list');

            const products: ResultSearchProduct[] = [];
            for (const product of resultSearch) {
                const sku =
                    $(product).find('.product-list__sku').text().trim() ?? null;
                const name = $(product)
                    .find('.product-list__title')
                    .text()
                    .trim();
                const detail =
                    $(product).find('.product-list__title').attr('href') ??
                    null;

                const image =
                    $(product)
                        .find('.product-list__img')
                        .find('img')
                        .attr('src') ?? null;
                const discountPercent =
                    parseInt(
                        $(product)
                            .find('.product-list__discount')
                            .text()
                            .trim()
                            .replace('%', ''),
                    ) ?? 0;

                let rating =
                    $(product).find('.product-list__desc').find('.ir').length ?? 0;
                rating = rating > 1 ? rating : 0;

                const description =
                    $(product)
                        .find('.product-list__desc')
                        .find('.product-list__p')
                        .text()
                        .trim() ?? null;
                const priceReal =
                    +$(product)
                        .find('.product-list__price-wrapper')
                        .find('.product-list__price--coret')
                        .text()
                        .trim()
                        .replace(/[\.a-zA-Z\s]+/g, '') ?? 0;
                const priceFinal =
                    +$(product)
                        .find('.product-list__price-wrapper')
                        .find('.product-list__price')
                        .text()
                        .trim()
                        .replace(/[\.a-zA-Z\s]+/g, '') ?? 0;

                const htmlBranchs = $(product)
                    .find('.product-list__stock--branch')
                    .find('.product-list__stock');

                const branchs = [];
                for (const htmlBranch of htmlBranchs) {
                    const branchStock = $(htmlBranch).text().trim().split('\n');
                    const branch = branchStock[0].trim();
                    let stock = branchStock[1].trim() ?? null;
                    if (stock === 'Remind me') {
                        stock = 'Kosong';
                    }

                    branchs.push({ branch, stock });
                }

                products.push({
                    sku,
                    name,
                    detail,
                    image,
                    discountPercent,
                    rating,
                    description,
                    priceReal,
                    priceFinal,
                    branchs,
                });
            }

            return products;
        } catch (error) {
            this.logger.debug('Error Service Search: ', error);
            throw new Error(error.message);
        }
    }
}
