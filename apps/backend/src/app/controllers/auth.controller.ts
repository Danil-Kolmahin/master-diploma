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
  Req,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { constants, publicEncrypt, randomBytes } from 'crypto';
import { InviteDto } from '../dto/invite.dto';
import { COOKIE_NAME, COOKIE_OPTIONS } from '@master-diploma/shared-resources';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('auth')
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
  @ApiQuery({ type: String, required: false })
  async signUp(
    @Body() { projectName, email, publicKey }: SignUpDto,
    @Query('inviteToken') inviteToken?: string
  ): Promise<void> {
    if (inviteToken) {
      const validInvite = await this.invitesService.findOneByBEP(
        inviteToken,
        email,
        projectName
      );
      if (!validInvite) throw new UnauthorizedException();

      await this.invitesService.delete(email, projectName);
    }

    await this.usersService.insert(email, publicKey);
    const { id: userId } = await this.usersService.findOneByEmail(email);

    if (!inviteToken) await this.projectsService.insert(projectName);
    const { id: projectId } = await this.projectsService.findOneByName(
      projectName
    );

    await this.casbinService.addRoleForUser(
      userId,
      inviteToken ? 'none' : 'root',
      projectId
    );
  }

  @Post('sign-in/challenge-request')
  @ApiCreatedResponse({ type: String })
  async signInChallengeRequest(
    @Body() { projectName, email }: SignInDto
  ): Promise<string> {
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
  ): Promise<void> {
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
    res.cookie(COOKIE_NAME, access_token, COOKIE_OPTIONS);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('sign-out')
  signOut(@Res({ passthrough: true }) res: Response): void {
    res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('invite')
  @ApiCreatedResponse({ type: String })
  async invite(
    @Req() { protocol, headers: { host } }: Request,
    @Body() { projectName, email }: InviteDto
  ): Promise<string> {
    const inviteToken = randomBytes(32).toString('hex');
    await this.invitesService.insert(inviteToken, email, projectName);
    return `${protocol}://${host}/auth/from-invite/${inviteToken}`;
  }
}
