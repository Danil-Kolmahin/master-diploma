import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { NamespaceDto, NewNamespaceDto } from '../dtos/namespaces.dto';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthDataI } from '@master-diploma/shared-resources';
import { AuthGuard } from '../guards/auth.guard';
import { NamespacesService } from '../services/namespaces.service';
import { CasbinService } from '../services/casbin.service';
import { SecurityKeysService } from '../services/security-key.service';
import { AuthData } from '../decorators/auth-data.decorator';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@ApiTags('namespaces')
@Controller('namespaces')
export class NamespacesController {
  constructor(
    private readonly namespacesService: NamespacesService,
    private readonly casbinService: CasbinService,
    private readonly securityKeysService: SecurityKeysService
  ) {}

  @Get()
  @ApiOkResponse({ type: [NamespaceDto] })
  async findByProjectId(
    @AuthData() { sub, projectId }: AuthDataI
  ): Promise<NamespaceDto[]> {
    const namespaces = await this.namespacesService.findByProjectId(projectId);

    const rights = await Promise.all(
      namespaces.map((n) =>
        this.casbinService.enforce(sub, n.id, 'read', projectId)
      )
    );

    const result = [];

    for (let i = 0; i < namespaces.length; i++)
      if (rights[i]) result.push(namespaces[i]);

    const securityKeys = await this.securityKeysService.findByProjectId(
      sub,
      projectId
    );

    return result.map((n) => ({
      ...n,
      encryptedSecurityKey: securityKeys.find((k) => k.entityId === n.id)
        ?.encryptedKey,
    }));
  }

  @Post()
  async insert(
    @AuthData() { sub, projectId }: AuthDataI,
    @Body() { name, parentId, encryptedSecurityKey }: NewNamespaceDto
  ): Promise<void> {
    await this.namespacesService.insert(name, projectId, parentId);

    const namespace = await this.namespacesService.findOne(name, projectId);

    await this.securityKeysService.insert(
      sub,
      projectId,
      namespace?.id,
      encryptedSecurityKey
    );
  }
}
