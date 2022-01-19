import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JaknotModule } from './jaknot/jaknot.module';
import { ShopeeModule } from './shopee/shopee.module';

@Module({
    imports: [JaknotModule, ConfigModule.forRoot(), ShopeeModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
