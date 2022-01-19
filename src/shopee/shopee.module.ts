import { Module } from '@nestjs/common';
import { ShopeeController } from './shopee.controller';
import { ShopeeService } from './shopee.service';

@Module({
    controllers: [ShopeeController],
    providers: [ShopeeService],
})
export class ShopeeModule {}
