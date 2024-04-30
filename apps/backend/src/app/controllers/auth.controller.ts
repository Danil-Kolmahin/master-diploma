import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  UnauthorizedException,
  Delete,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { constants, publicEncrypt, randomBytes } from 'crypto';
import {
  AuthDataI,
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from '@master-diploma/shared-resources';
import { ApiCookieAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { ProjectsService } from '../services/projects.service';
import { ChallengesService } from '../services/challenge.service';
import { CasbinService } from '../services/casbin.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthData } from '../decorators/auth-data.decorator';
import { SignInAndVerifyChallengeDto, SignInDto } from '../dtos/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService,
    private readonly challengesService: ChallengesService,
    private readonly casbinService: CasbinService
  ) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('session')
  getProfile(@AuthData() data: AuthDataI) {
    return data;
  }

  @Post('challenge')
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

  @Post('session')
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
  @Delete('session')
  signOut(@Res({ passthrough: true }) res: Response): void {
    res.cookie(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  }
}
