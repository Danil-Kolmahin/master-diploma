import {
  AuthGuard,
  AuthService,
  ChallengesService,
  ProjectsService,
  SignInAndVerifyChallengeDto,
  SignInDto,
  SignUpDto,
  UsersService,
  InvitesService,
  CasbinService,
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
  Param,
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
    private readonly challengesService: ChallengesService,
    private readonly invitesService: InvitesService,
    private readonly casbinService: CasbinService
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
    // TODO: add user to project
    console.log(await this.casbinService.enforce(id, 'universe', 'write'));
    await this.casbinService.addRoleForUser(id, 'root');
    console.log(await this.casbinService.enforce(id, 'universe', 'write'));
  }

  @Post('sign-in/challenge-request')
  async signInChallengeRequest(@Body() { projectName, email }: SignInDto) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    // TODO: project membership
    // const project = await this.projectsService.findOneByNameAndUserId(
    //   projectName,
    //   user.id
    // );
    // if (!project) throw new UnauthorizedException();

    const challenge = randomBytes(32).toString('hex');
    await this.challengesService.insert(challenge, user.id);

    return publicEncrypt(
      {
        key: user.publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(challenge)
    ).toString('base64');
  }

  @Post('sign-in/challenge-response')
  async signInChallengeResponse(
    @Body() { projectName, email, challenge }: SignInAndVerifyChallengeDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    // TODO: project membership
    // const project = await this.projectsService.findOneByNameAndUserId(
    //   projectName,
    //   user.id
    // );
    // if (!project) throw new UnauthorizedException();

    const validChallenge = await this.challengesService.findOneByBodyAndUserId(
      challenge,
      user.id
    );
    if (!validChallenge) throw new UnauthorizedException();

    await this.challengesService.delete(challenge, user.id);
    const access_token = await this.authService.signIn(email, projectName);
    res.cookie('SMS_ACCESS_TOKEN', access_token, {
      maxAge: 5 * 60 * 1000,
      // TODO: secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('SMS_ACCESS_TOKEN', '', {
      maxAge: 0,
      // TODO: secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });
  }

  @Post('invite')
  @UseGuards(AuthGuard)
  async invite(@Req() req, @Body() { projectName, email }: SignInDto) {
    const inviteToken = randomBytes(32).toString('hex');
    await this.invitesService.insert(
      inviteToken,
      email,
      projectName,
      req.user.sub
    );
    return `http://localhost:4200/auth/from-invite/${inviteToken}`; // TODO: url
  }

  @Post('sign-up/from-invite/:inviteToken')
  async signUpFromInvite(
    @Param('inviteToken') inviteToken: string,
    @Body() { projectName, email, publicKey }: SignUpDto
  ) {
    const validInvite = await this.invitesService.findOneByBEP(
      inviteToken,
      email,
      projectName
    );

    if (!validInvite) throw new UnauthorizedException();

    await this.invitesService.delete(email, projectName);
    await this.userService.insert(email, publicKey);
    const { id } = await this.userService.findOneByEmail(email);
    // TODO: add user to project
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}
