import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello() {
        return {
            name: "API Search Marketplace",
            version: "1.0",
            documentation: "/api"
        };
    }
}
