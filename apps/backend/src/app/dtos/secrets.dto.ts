import { CreateSecretDtoI, SecretI } from '@master-diploma/shared-resources';
import { IsString, IsUUID } from 'class-validator';
import { BaseEntityDto } from './base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSecretDto implements CreateSecretDtoI {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  encryptedValue: string;

  @ApiProperty()
  @IsUUID(4)
  namespaceId: string;
}

export class SecretDto extends BaseEntityDto implements SecretI {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID(4)
  projectId: string;

  @ApiProperty()
  @IsUUID(4)
  namespaceId: string;

  @ApiProperty()
  @IsString()
  encryptedValue: string;
}
