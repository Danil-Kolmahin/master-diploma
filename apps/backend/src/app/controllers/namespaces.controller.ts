import {
  AuthData,
  AuthGuard,
  CasbinService,
  NamespacesService,
  SecurityKeysService,
} from '@master-diploma/library';
import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { NamespaceDto } from '../dto/namespace.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthDataI } from '@master-diploma/shared-resources';

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
  async findByProjectId(@AuthData() { sub, projectId }: AuthDataI) {
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
    @Body() { name, parentId, encryptedSecurityKey }: NamespaceDto
  ) {
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
