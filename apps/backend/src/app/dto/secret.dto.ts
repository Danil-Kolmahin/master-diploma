import { IsString, IsUUID } from 'class-validator';

export class SecretDto {
  @IsString()
  name: string;

  @IsString()
  encryptedValue: string;

  @IsUUID(4)
  namespaceId: string;
}
