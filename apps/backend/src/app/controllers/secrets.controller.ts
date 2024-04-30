import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { SecretDto } from '../dtos/secret.dto';
import { AuthDataI } from '@master-diploma/shared-resources';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { SecretsService } from '../services/secrets.service';
import { AuthData } from '../decorators/auth-data.decorator';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@ApiTags('secrets')
@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @Get()
  getAllSecrets(@AuthData() { projectId }: AuthDataI) {
    return this.secretsService.getAllSecrets(projectId);
  }

  @Post()
  async insert(
    @AuthData() { projectId }: AuthDataI,
    @Body() { name, encryptedValue, namespaceId }: SecretDto
  ) {
    await this.secretsService.insert(
      name,
      encryptedValue,
      projectId,
      namespaceId
    );
  }
}
