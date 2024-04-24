import { AuthGuard, CasbinService } from '@master-diploma/library';
import {
  Controller,
  UseGuards,
  Req,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { AddRoleDto } from '../dto/roles.dto';

@Controller()
export class PermissionsController {
  constructor(private readonly casbinService: CasbinService) {}

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
}
