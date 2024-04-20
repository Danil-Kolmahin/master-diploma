import { AuthGuard, SecretsService } from '@master-diploma/library';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { SecretDto } from '../dto/secret.dto';

@Controller('secrets')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @Get('all/:namespaceId')
  @UseGuards(AuthGuard)
  findByNamespaceId(@Param('namespaceId') namespaceId: string) {
    return this.secretsService.findByNamespaceId(namespaceId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async insert(
    @Req() req: Request,
    @Body() { name, encryptedValue, namespaceId }: SecretDto
  ) {
    await this.secretsService.insert(
      name,
      encryptedValue,
      (req as any).user.projectId,
      namespaceId
    );
  }
}
