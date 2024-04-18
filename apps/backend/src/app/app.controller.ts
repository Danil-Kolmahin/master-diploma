import { AuthGuard } from '@master-diploma/library';
import { Controller, UseGuards, Get, Req } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
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

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}
