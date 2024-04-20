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
  Res,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { Response } from 'express';

import { constants, publicEncrypt, randomBytes } from 'crypto';

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService,
    private readonly challengesService: ChallengesService,
    private readonly invitesService: InvitesService,
    private readonly casbinService: CasbinService
  ) {}

  @Post('sign-up')
  async signUp(@Body() { projectName, email, publicKey }: SignUpDto) {
    await this.usersService.insert(email, publicKey);
    const { id: userId } = await this.usersService.findOneByEmail(email);

    await this.projectsService.insert(projectName);
    const { id: projectId } = await this.projectsService.findOneByName(
      projectName
    );

    await this.casbinService.addRoleForUser(userId, 'root', projectId);
  }

  @Post('sign-in/challenge-request')
  async signInChallengeRequest(@Body() { projectName, email }: SignInDto) {
    const user = await this.usersService.findOneByEmail(email);
    const project = await this.projectsService.findOneByName(projectName);
    if (!user || !project) throw new UnauthorizedException();

    const hasRoleInProject = await this.casbinService.hasRoleInProject(
      user.id,
      project.id
    );
    if (!hasRoleInProject) throw new UnauthorizedException();

    const challenge = randomBytes(32).toString('hex');
    await this.challengesService.insert(challenge);

    return publicEncrypt(
      {
        key: Buffer.from(user.publicKey),
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
    const user = await this.usersService.findOneByEmail(email);
    const project = await this.projectsService.findOneByName(projectName);
    if (!user || !project) throw new UnauthorizedException();

    const hasRoleInProject = await this.casbinService.hasRoleInProject(
      user.id,
      project.id
    );
    if (!hasRoleInProject) throw new UnauthorizedException();

    const validChallenge = await this.challengesService.findOneByBody(
      challenge
    );
    if (!validChallenge) throw new UnauthorizedException();

    await this.challengesService.delete(challenge);
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
  async invite(@Body() { projectName, email }: SignInDto) {
    const inviteToken = randomBytes(32).toString('hex');
    await this.invitesService.insert(inviteToken, email, projectName);
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
    await this.usersService.insert(email, publicKey);
    const { id: userId } = await this.usersService.findOneByEmail(email);
    const { id: projectId } = await this.projectsService.findOneByName(
      projectName
    );

    await this.casbinService.addRoleForUser(userId, 'root', projectId);
  }
}
