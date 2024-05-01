import { AuthDataI } from '@master-diploma/shared-resources';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { TracesService } from '../services/traces.service';
import { AuthData } from '../decorators/auth-data.decorator';
import { Trace } from '../entities/trace.entity';
import { TraceDto } from '../dtos/security.dto';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@ApiTags('security')
@Controller('security')
export class SecurityController {
  constructor(private readonly tracesService: TracesService) {}

  @Get('audit')
  @ApiOkResponse({ type: [TraceDto] })
  audit(@AuthData() { projectId }: AuthDataI): Promise<Trace[]> {
    return this.tracesService.findByProjectId(projectId);
  }
}
