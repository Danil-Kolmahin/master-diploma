import { AuthData, AuthGuard, SecretsService } from '@master-diploma/library';
import { Body, Controller, Post, UseGuards, Get, Param } from '@nestjs/common';
import { SecretDto } from '../dto/secret.dto';
import { AuthDataI } from '@master-diploma/shared-resources';

@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @Get('all')
  @UseGuards(AuthGuard)
  getAllSecrets(@AuthData() { projectId }: AuthDataI) {
    return this.secretsService.getAllSecrets(projectId);
  }

  @Get('all/:namespaceId')
  @UseGuards(AuthGuard)
  findByNamespaceId(@Param('namespaceId') namespaceId: string) {
    return this.secretsService.findByNamespaceId(namespaceId);
  }

  @Post()
  @UseGuards(AuthGuard)
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
