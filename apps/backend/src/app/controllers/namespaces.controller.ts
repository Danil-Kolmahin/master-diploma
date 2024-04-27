import {
  AuthGuard,
  CasbinService,
  NamespacesService,
  SecurityKeysService,
} from '@master-diploma/library';
import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { NamespaceDto } from '../dto/namespace.dto';
import { ApiCookieAuth } from '@nestjs/swagger';

@ApiCookieAuth()
@Controller('namespaces')
@UseGuards(AuthGuard)
export class NamespacesController {
  constructor(
    private readonly namespacesService: NamespacesService,
    private readonly casbinService: CasbinService,
    private readonly securityKeysService: SecurityKeysService
  ) {}

  @Get('all')
  async findByProjectId(@Req() req: Request) {
    const namespaces = await this.namespacesService.findByProjectId(
      (req as any).user.projectId
    );

    const rights = await Promise.all(
      namespaces.map((n) =>
        this.casbinService.enforce(
          (req as any).user.sub,
          n.id,
          'read',
          (req as any).user.projectId
        )
      )
    );

    const result = [];

    for (let i = 0; i < namespaces.length; i++)
      if (rights[i]) result.push(namespaces[i]);

    const securityKeys = await this.securityKeysService.findByProjectId(
      (req as any).user.sub,
      (req as any).user.projectId
    );

    return result.map((n) => ({
      ...n,
      encryptedSecurityKey: securityKeys.find((k) => k.entityId === n.id)
        ?.encryptedKey,
    }));
  }

  @Post()
  async insert(
    @Req() req: Request,
    @Body() { name, parentId, encryptedSecurityKey }: NamespaceDto
  ) {
    await this.namespacesService.insert(
      name,
      (req as any).user.projectId,
      parentId
    );

    const namespace = await this.namespacesService.findOne(
      name,
      (req as any).user.projectId
    );

    await this.securityKeysService.insert(
      (req as any).user.sub,
      (req as any).user.projectId,
      namespace?.id,
      encryptedSecurityKey
    );
  }
}
