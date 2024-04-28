import {
  AuthGuard,
  CasbinService,
  SecurityKeysService,
  TracesService,
  UsersService,
} from '@master-diploma/library';
import {
  Controller,
  UseGuards,
  Req,
  Get,
  Param,
  Post,
  Body,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AddRoleDto, ChangeUserRoleDto } from '../dto/roles.dto';

@Controller()
export class PermissionsController {
  constructor(
    private readonly casbinService: CasbinService,
    private readonly securityKeysService: SecurityKeysService,
    private readonly usersService: UsersService,
    private readonly tracesService: TracesService
  ) {}

  @Get('members')
  @UseGuards(AuthGuard)
  findByProjectId(@Req() req: Request) {
    return this.casbinService.findUsersInProject((req as any).user.projectId);
  }

  @Get('roles')
  @UseGuards(AuthGuard)
  getAllRolesNames(@Req() req: Request) {
    return this.casbinService.getAllRolesNames((req as any).user.projectId);
  }

  @Get('roles/:roleName')
  @UseGuards(AuthGuard)
  findRoleByName(@Req() req: Request, @Param('roleName') roleName: string) {
    return this.casbinService.findRoleByName(
      roleName,
      (req as any).user.projectId
    );
  }

  @Post('roles')
  @UseGuards(AuthGuard)
  addRole(@Req() req: Request, @Body() { roleName, policies }: AddRoleDto) {
    return this.casbinService.addRole(
      roleName,
      (req as any).user.projectId,
      policies
    );
  }

  @Get('roles/:roleName/security-keys')
  @UseGuards(AuthGuard)
  async getRoleSecurityKeys(
    @Req() req: Request,
    @Param('roleName') roleName: string
  ) {
    const securityKeys = await this.securityKeysService.findByProjectId(
      (req as any).user.sub,
      (req as any).user.projectId
    );
    const rolePolicies = await this.casbinService.findRoleByName(
      roleName,
      (req as any).user.projectId
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
    @Req() req: Request,
    @Body()
    { userId, roleName, entities }: ChangeUserRoleDto
  ) {
    await this.securityKeysService.deleteAllUserKeys(
      userId,
      (req as any).user.projectId
    );
    await this.casbinService.changeUserRole(
      userId,
      roleName,
      (req as any).user.projectId
    );

    await Promise.all(
      entities.map(({ entityId, encryptedSecurityKey }) =>
        this.securityKeysService.insert(
          userId,
          (req as any).user.projectId,
          entityId,
          encryptedSecurityKey
        )
      )
    );
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

  @Get('other/audit')
  @UseGuards(AuthGuard)
  async audit(@Req() req: Request) {
    return this.tracesService.findByProjectId((req as any).user.projectId);
  }
}
