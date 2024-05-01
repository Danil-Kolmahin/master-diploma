import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { CreateSecretDto, SecretDto } from '../dtos/secrets.dto';
import { AuthDataI } from '@master-diploma/shared-resources';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { SecretsService } from '../services/secrets.service';
import { AuthData } from '../decorators/auth-data.decorator';
import { Secret } from '../entities/secret.entity';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@ApiTags('secrets')
@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @Get()
  @ApiOkResponse({ type: [SecretDto] })
  getAllSecrets(@AuthData() { projectId }: AuthDataI): Promise<Secret[]> {
    return this.secretsService.getAllSecrets(projectId);
  }

  @Post()
  async insert(
    @AuthData() { projectId }: AuthDataI,
    @Body() { name, encryptedValue, namespaceId }: CreateSecretDto
  ): Promise<void> {
    await this.secretsService.insert(
      name,
      encryptedValue,
      projectId,
      namespaceId
    );
  }
}
