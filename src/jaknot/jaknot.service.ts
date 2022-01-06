import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class JaknotService {
    home() {
        return 'Welcome to Jakarta Notebook Scraper';
    }

    async test() {
        const url =
            'https://www.jakartanotebook.com/samsung-portable-ssd-t5-1tb-mu-pa1t0b-black';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const price = $('.price-final').text();

        const images = $('.detailGallery').find('a');

        const listImages = [];
        for (const image of images) {
            listImages.push($(image).find('img').attr('src'));
        }

        console.log({ price, listImages });
    }
}
