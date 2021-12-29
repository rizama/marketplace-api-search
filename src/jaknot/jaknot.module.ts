import { Module } from '@nestjs/common';
import { JaknotController } from './jaknot.controller';
import { JaknotService } from './jaknot.service';

@Module({
  controllers: [JaknotController],
  providers: [JaknotService]
})
export class JaknotModule {}
