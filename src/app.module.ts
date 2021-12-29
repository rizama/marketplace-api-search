import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JaknotModule } from './jaknot/jaknot.module';

@Module({
  imports: [JaknotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
