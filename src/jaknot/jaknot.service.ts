import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Filter } from './enums/search.enum';
import { DetailParamDto } from './models/detail-product.models';
import { SearchQueryDto, ResultSearchProduct } from './models/search.models';

@Injectable()
export class JaknotService {
    private readonly logger = new Logger('JaknotService');
    private readonly USER_AGENT =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0';

    async searchV1(querySring: SearchQueryDto): Promise<ResultSearchProduct[]> {
        try {
            const { query, branch, show, sort, ready } = querySring;

            let filterByAvailabaleInBranch;
            if (ready) {
                filterByAvailabaleInBranch = Filter[ready];
            }

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

                const slug = detail ? detail.split('/')[3] : null;

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
                    $(product).find('.product-list__desc').find('.ir').length ??
                    0;
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
                    slug,
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

    async detailV1(params: DetailParamDto) {
        const { slug } = params;

        const url = `${process.env.BASE_URL_JAKNOT}/${slug}`;

        const { data } = await axios.get(url, {
            headers: {
                Accept: 'text/html,*/*',
                'User-Agent': this.USER_AGENT,
                cookie: `selectedGroupBranch=bandung;`,
            },
        });

        const $ = cheerio.load(data);

        const title = $('.title').find('span').text().trim();

        let rating =
            $('.detailInfo > div.reviewTop > div').find('.ir').length ?? 0;
        rating = rating > 1 ? rating : 0;

        const sku =
            $('.detailInfo > dl > dd:nth-child(2)').text().trim() ?? null;

        const weight =
            $('.detailInfo > dl > dd:nth-child(4)').text().trim() ?? null;

        const warranty =
            $('.detailInfo > dl > dd:nth-child(6)').text().trim() ?? null;

        const colorListHtml = $('.detailInfo > dl')
            .find('.detailColor')
            .find('li');
        const colors = [];
        for (const colorHtml of colorListHtml) {
            const name = $(colorHtml).find('a').attr('title').trim() ?? null;
            const otherProduct = $(colorHtml).find('a').attr('href').trim() ?? null;
            const colorCode = $(colorHtml).find('a').attr('style').trim()?.split(":")[1] ?? null;

            colors.push({ name, otherProduct, colorCode });
        }

        const stockBranchHtml = $('.detailInfo > dl')
        .find('.product-list__stock--branch')
        .find('.product-list__stock');

        const branchs = [];
        for (const htmlBranch of stockBranchHtml) {
            const branch = $(htmlBranch).find('.product-list__stock__branch-name').text().trim();

            const stock = $(htmlBranch).attr('class').trim().includes('product-list__stock--ready') ? 'Tersedia' : 'Tidak Tersedia';

            branchs.push({ branch, stock });
        }

        return { title, rating, sku, weight, warranty, colors, branchs };
    }
}
