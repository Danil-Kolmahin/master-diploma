import { AuthGuard, UsersService } from '@master-diploma/library';
import { Controller, UseGuards, Get, Req, Param } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get('version')
  version() {
    return process.env.npm_package_version;
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Request) {
    const user = await this.usersService.findOneByEmail(
      (req as any).user.email
    );
    return { ...user, ...(req as any).user };
  }

  @Get('users/:email')
  @UseGuards(AuthGuard)
  async findUserByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
}
