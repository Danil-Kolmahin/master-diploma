import { Controller, Get } from '@nestjs/common';

// import { BasicAuthGuard } from '@master-diploma/library';

import { AppService } from './app.service';

@Controller()
// @UseGuards(BasicAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('version')
  version() {
    return process.env.npm_package_version;
  }

  @Get('api')
  getData() {
    return this.appService.getData();
  }
}
