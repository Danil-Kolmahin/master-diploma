import { AuthData, AuthGuard, TracesService } from '@master-diploma/library';
import { AuthDataI } from '@master-diploma/shared-resources';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(private readonly tracesService: TracesService) {}

  @UseGuards(AuthGuard)
  @Get('audit')
  @ApiOkResponse()
  async audit(@AuthData() { projectId }: AuthDataI): Promise<any> {
    return this.tracesService.findByProjectId(projectId);
  }
}
