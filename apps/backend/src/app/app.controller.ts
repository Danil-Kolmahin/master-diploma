import {
  AuthGuard,
  AuthService,
  ChallengesService,
  ProjectsService,
  SignInAndVerifyChallengeDto,
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
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';
import { constants, publicEncrypt, randomBytes } from 'crypto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService,
    private readonly challengesService: ChallengesService
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

  @Post('sign-in/challenge-request')
  async signInChallengeRequest(@Body() { projectName, email }: SignInDto) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const project = await this.projectsService.findOneByNameAndUserId(
      projectName,
      user.id
    );
    if (!project) throw new UnauthorizedException();

    const challenge = randomBytes(32).toString('hex');
    await this.challengesService.insert(challenge, user.id);

    console.log(challenge, user.publicKey.toString());

    return publicEncrypt(
      {
        key: user.publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(challenge, 'utf8')
    ).toString('base64');
  }

  @Post('sign-in/challenge-response')
  async signInChallengeResponse(
    @Body() { projectName, email, challenge }: SignInAndVerifyChallengeDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const project = await this.projectsService.findOneByNameAndUserId(
      projectName,
      user.id
    );
    if (!project) throw new UnauthorizedException();

    const validChallenge = await this.challengesService.findOneByBodyAndUserId(
      challenge,
      user.id
    );
    if (!validChallenge) throw new UnauthorizedException();

    const access_token = await this.authService.signIn(email, projectName);
    res.cookie('SMS_access_token', access_token, {
      maxAge: 5 * 60 * 1000,
      // TODO: secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('SMS_access_token', '', {
      maxAge: 0,
      // TODO: secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}
