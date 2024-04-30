import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AddRoleDto } from '../dtos/roles.dto';
import { AuthDataI } from '@master-diploma/shared-resources';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { CasbinService } from '../services/casbin.service';
import { SecurityKeysService } from '../services/security-key.service';
import { AuthData } from '../decorators/auth-data.decorator';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly casbinService: CasbinService,
    private readonly securityKeysService: SecurityKeysService
  ) {}

  @Get('names')
  getAllRolesNames(@AuthData() { projectId }: AuthDataI) {
    return this.casbinService.getAllRolesNames(projectId);
  }

  @Get(':name')
  findRoleByName(
    @AuthData() { projectId }: AuthDataI,
    @Param('name') name: string
  ) {
    return this.casbinService.findRoleByName(name, projectId);
  }

  @Post()
  addRole(
    @AuthData() { projectId }: AuthDataI,
    @Body() { roleName, policies }: AddRoleDto
  ) {
    return this.casbinService.addRole(roleName, projectId, policies);
  }

  @Get(':name/access-requirements')
  async getRoleSecurityKeys(
    @AuthData() { sub, projectId }: AuthDataI,
    @Param('name') name: string
  ) {
    const securityKeys = await this.securityKeysService.findByProjectId(
      sub,
      projectId
    );
    const rolePolicies = await this.casbinService.findRoleByName(
      name,
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
}
