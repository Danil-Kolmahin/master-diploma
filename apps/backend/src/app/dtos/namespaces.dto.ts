import {
  NamespaceDtoI,
  NewNamespaceDtoI,
} from '@master-diploma/shared-resources';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';
import { BaseEntityDto } from './base.dto';

export class NewNamespaceDto implements NewNamespaceDtoI {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsUUID(4)
  @IsOptional()
  parentId?: string;

  @ApiProperty()
  @IsString()
  encryptedSecurityKey: string;
}

export class NamespaceDto extends BaseEntityDto implements NamespaceDtoI {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsUUID(4)
  @IsOptional()
  parentId?: string;

  @ApiProperty()
  @IsString()
  encryptedSecurityKey: string;

  @ApiProperty()
  @IsUUID(4)
  projectId: string;
}
