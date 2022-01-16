import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello() {
        return {
            name: "API Search Marketplace",
            version: "1.0",
            documentation: process.env.APP_MODE === 'development' ? 'http://localhost:3000/api' : 'https://marketplace-api-search-rizama.vercel.app/api'
        };
    }
}
