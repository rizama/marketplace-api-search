import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchPayloadDto, SearchResponseInterface } from './dto/search.dto';

@Injectable()
export class JaknotService {
    private readonly logger = new Logger('JaknotService');
    private readonly USER_AGENT =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0';

    home() {
        return 'Welcome to Jakarta Notebook Scraper';
    }

    async search(
        querySring: SearchPayloadDto,
    ): Promise<SearchResponseInterface[]> {
        try {
            const { query, branch } = querySring;

            const url = `${process.env.BASE_URL_JAKNOT}search?key=${query}`;

            const { data } = await axios.get(url, {
                headers: {
                    Accept: 'text/html,*/*',
                    'User-Agent': this.USER_AGENT,
                    cookie: `selectedGroupBranch=${branch};`,
                },
                withCredentials: true,
            });
            const $ = cheerio.load(data);

            const resultSearch = $('.product-list');

            const products: SearchResponseInterface[] = [];
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

                const rating =
                    $(product).find('.product-list__desc').find('.ir').length ??
                    0;
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
            this.logger.debug('Finished');
            return products;
        } catch (error) {
            this.logger.debug('Error Service Search: ', error);
            throw new Error(error.message);
        }
    }
}

enum BranchCity {
    Jabodetabek = 'jabodetabek',
    Bandung = 'bandung',
    Semarang = 'semarang',
    Surabaya = 'surabaya',
    Medan = 'medan',
    Yogyakarta = 'yogyakarta',
}