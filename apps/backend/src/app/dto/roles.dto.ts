import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

export class AddRoleDto {
  @IsString()
  roleName: string;

  @IsArray()
  policies: any[];
}

export class ChangeUserRoleDto {
  @IsUUID(4)
  userId: string;

  @IsString()
  roleName: string;

  @ValidateNested({ each: true })
  @Type(() => EntitiesToReEncryptDto)
  entities: EntitiesToReEncryptDto[];
}

export class EntitiesToReEncryptDto {
  @IsString()
  encryptedSecurityKey: string;

  @IsUUID(4)
  entityId: string;
}
