import {
  AuthGuard,
  CasbinService,
  NamespacesService,
} from '@master-diploma/library';
import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { NamespaceDto } from '../dto/namespace.dto';

@Controller('namespaces')
export class NamespacesController {
  constructor(
    private readonly namespacesService: NamespacesService,
    private readonly casbinService: CasbinService
  ) {}

  @Get('all')
  @UseGuards(AuthGuard)
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

    return result;
  }

  @Post()
  @UseGuards(AuthGuard)
  async insert(@Req() req: Request, @Body() { name, parentId }: NamespaceDto) {
    await this.namespacesService.insert(
      name,
      (req as any).user.projectId,
      parentId
    );
  }
}
