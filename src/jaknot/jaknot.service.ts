import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchPayloadDto, SearchResponseDto } from './dto/search.dto';

@Injectable()
export class JaknotService {
    home() {
        return 'Welcome to Jakarta Notebook Scraper';
    }

    async search(querySring: SearchPayloadDto): Promise<SearchResponseDto[]> {
        const { query } = querySring;

        const url = `${process.env.BASE_URL_JAKNOT}search?key=${query}`;

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const resultSearch = $('.product-list');

        const products = [];
        for (const product of resultSearch) {
            const sku = $(product).find('.product-list__sku').text().trim();
            const name = $(product).find('.product-list__title').text().trim();
            const detail = $(product).find('.product-list__title').attr('href');

            const image = $(product)
                .find('.product-list__img')
                .find('img')
                .attr('src');
            const discount = $(product)
                .find('.product-list__discount')
                .text()
                .trim();

            const rating = $(product)
                .find('.product-list__desc')
                .find('.ir').length;
            const description = $(product)
                .find('.product-list__desc')
                .find('.product-list__p')
                .text()
                .trim();
            const priceReal = $(product)
                .find('.product-list__price-wrapper')
                .find('.product-list__price--coret')
                .text()
                .trim();
            const priceFinal = $(product)
                .find('.product-list__price-wrapper')
                .find('.product-list__price')
                .text()
                .trim();

            products.push({
                sku,
                name,
                detail,
                image,
                discount,
                rating,
                description,
                priceReal,
                priceFinal,
            });
        }

        return products;
    }
}
