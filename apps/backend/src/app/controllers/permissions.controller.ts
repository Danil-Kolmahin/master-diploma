import {
  AuthData,
  AuthGuard,
  CasbinService,
  SecurityKeysService,
  UsersService,
} from '@master-diploma/library';
import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { AddRoleDto, ChangeUserRoleDto } from '../dto/roles.dto';
import { AuthDataI } from '@master-diploma/shared-resources';

@Controller()
export class PermissionsController {
  constructor(
    private readonly casbinService: CasbinService,
    private readonly securityKeysService: SecurityKeysService,
    private readonly usersService: UsersService
  ) {}

  @Get('members')
  @UseGuards(AuthGuard)
  findByProjectId(@AuthData() { projectId }: AuthDataI) {
    return this.casbinService.findUsersInProject(projectId);
  }

  @Get('roles')
  @UseGuards(AuthGuard)
  getAllRolesNames(@AuthData() { projectId }: AuthDataI) {
    return this.casbinService.getAllRolesNames(projectId);
  }

  @Get('roles/:roleName')
  @UseGuards(AuthGuard)
  findRoleByName(
    @AuthData() { projectId }: AuthDataI,
    @Param('roleName') roleName: string
  ) {
    return this.casbinService.findRoleByName(roleName, projectId);
  }

  @Post('roles')
  @UseGuards(AuthGuard)
  addRole(
    @AuthData() { projectId }: AuthDataI,
    @Body() { roleName, policies }: AddRoleDto
  ) {
    return this.casbinService.addRole(roleName, projectId, policies);
  }

  @Get('roles/:roleName/security-keys')
  @UseGuards(AuthGuard)
  async getRoleSecurityKeys(
    @AuthData() { sub, projectId }: AuthDataI,
    @Param('roleName') roleName: string
  ) {
    const securityKeys = await this.securityKeysService.findByProjectId(
      sub,
      projectId
    );
    const rolePolicies = await this.casbinService.findRoleByName(
      roleName,
      projectId
    );
    const response = rolePolicies
      .filter(([, action]) => action === 'read')
      .map(([object]) => ({
        entityId: object,
        encryptedSecurityKey: securityKeys.find(
          ({ entityId }) => entityId === object
        ).encryptedKey,
      }));

    if (response.some(({ encryptedSecurityKey }) => !encryptedSecurityKey))
      throw new UnauthorizedException();

    return response;
  }

  @Patch('members/role')
  @UseGuards(AuthGuard)
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

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@AuthData() data: AuthDataI) {
    const user = await this.usersService.findOneByEmail(data.email);
    return { ...user, ...data };
  }

  @Get('users/:email')
  @UseGuards(AuthGuard)
  async findUserByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
}
