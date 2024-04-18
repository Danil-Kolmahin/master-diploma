import { AuthGuard, NamespacesService } from '@master-diploma/library';
import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { NamespaceDto } from '../dto/namespace.dto';

@Controller('namespaces')
export class NamespacesController {
  constructor(private readonly namespacesService: NamespacesService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  findByProjectId(@Req() req: Request) {
    return this.namespacesService.findByProjectId((req as any).user.projectId);
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
