import { Controller, Get } from '@nestjs/common';
import { JaknotService } from './jaknot.service';

@Controller('jaknot')
export class JaknotController {
    constructor(private readonly jaknotService: JaknotService) {}

    @Get('/')
    home() {
        return this.jaknotService.home();
    }

    @Get('test')
    test() {
        return this.jaknotService.test();
    }
}
