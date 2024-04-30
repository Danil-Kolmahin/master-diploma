import { AuthData, AuthGuard, TracesService } from '@master-diploma/library';
import { AuthDataI } from '@master-diploma/shared-resources';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(private readonly tracesService: TracesService) {}

  @Get('audit')
  @ApiOkResponse()
  async audit(@AuthData() { projectId }: AuthDataI): Promise<any> {
    return this.tracesService.findByProjectId(projectId);
  }
}
