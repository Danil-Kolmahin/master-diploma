import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { InviteDto } from '../dtos/invite.dto';
import { randomBytes } from 'crypto';
import { AuthDataI } from '@master-diploma/shared-resources';
import { ChangeUserRoleDto } from '../dtos/roles.dto';
import { UsersService } from '../services/users.service';
import { ProjectsService } from '../services/projects.service';
import { InvitesService } from '../services/invites.service';
import { CasbinService } from '../casbin/casbin.service';
import { SecurityKeysService } from '../services/security-key.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthData } from '../decorators/auth-data.decorator';
import { SignUpDto } from '../dtos/sign-up.dto';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private readonly invitesService: InvitesService,
    private readonly casbinService: CasbinService,
    private readonly securityKeysService: SecurityKeysService
  ) {}

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get()
  findByProjectId(@AuthData() { projectId }: AuthDataI) {
    return this.casbinService.findUsersInProject(projectId);
  }

  @Post()
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

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Patch('role')
  async changeUserRole(
    @AuthData() { projectId }: AuthDataI,
    @Body()
    { userId, roleName, entities }: ChangeUserRoleDto
  ) {
    await this.securityKeysService.deleteAllUserKeys(userId, projectId);
    await this.casbinService.changeUserRole(userId, roleName, projectId);

    await Promise.all(
      entities.map(({ entityId, encryptedSecurityKey }) =>
        this.securityKeysService.insert(
          userId,
          projectId,
          entityId,
          encryptedSecurityKey
        )
      )
    );
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('invites')
  @ApiCreatedResponse({ type: String })
  async invite(@Body() { projectName, email }: InviteDto): Promise<string> {
    const inviteToken = randomBytes(32).toString('hex');
    await this.invitesService.insert(inviteToken, email, projectName);
    return `/auth/from-invite/${inviteToken}`;
  }
}
