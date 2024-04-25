import { AuthGuard, UsersService } from '@master-diploma/library';
import { Controller, UseGuards, Get, Req } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService
  ) {}

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
  async getProfile(@Req() req) {
    const user = await this.usersService.findOneByEmail(req.user.email);
    return { ...user, ...req.user };
  }
}
