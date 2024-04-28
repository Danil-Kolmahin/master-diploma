import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('system')
@Controller('system')
export class SystemController {
  @Get('version')
  @ApiOkResponse({ type: String })
  version(): string {
    return process.env.npm_package_version || 'vx.x.x';
  }
}
