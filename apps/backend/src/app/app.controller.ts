import {
  AuthGuard,
  AuthService,
  ProjectsService,
  SignInDto,
  SignUpDto,
  UsersService,
} from '@master-diploma/library';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService
  ) {}

  @Get('version')
  version() {
    return process.env.npm_package_version;
  }

  @Get('api')
  getData() {
    return this.appService.getData();
  }

  @Post('sign-up')
  async signUp(@Body() { projectName, email, publicKey }: SignUpDto) {
    await this.userService.insert(email, publicKey);
    const { id } = await this.userService.findOneByEmail(email);
    await this.projectsService.insert(projectName, id);
  }

  @Post('sign-in')
  signIn(@Body() { projectName, email }: SignInDto) {
    return this.authService.signIn({ projectName, email });
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
