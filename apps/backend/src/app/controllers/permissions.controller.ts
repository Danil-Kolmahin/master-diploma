import { AuthGuard, CasbinService } from '@master-diploma/library';
import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly casbinService: CasbinService) {}

  @Get('members')
  @UseGuards(AuthGuard)
  findByProjectId(@Req() req: Request) {
    return this.casbinService.findUsersInProject((req as any).user.projectId);
  }
}
