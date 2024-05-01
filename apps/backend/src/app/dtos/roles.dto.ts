import {
  AddRoleDtoI,
  ChangeUserRoleDtoI,
  EntitiesToReEncryptDtoI,
  RoleContentDtoI,
} from '@master-diploma/shared-resources';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

export class RoleContentDto implements RoleContentDtoI {
  @ApiProperty()
  @IsArray({ each: true })
  policies: string[][];
}

export class AddRoleDto extends RoleContentDto implements AddRoleDtoI {
  @ApiProperty()
  @IsString()
  roleName: string;
}

export class EntitiesToReEncryptDto implements EntitiesToReEncryptDtoI {
  @ApiProperty()
  @IsString()
  encryptedSecurityKey: string;

  @ApiProperty()
  @IsUUID(4)
  entityId: string;
}

export class ChangeUserRoleDto implements ChangeUserRoleDtoI {
  @ApiProperty()
  @IsUUID(4)
  userId: string;

  @ApiProperty()
  @IsString()
  roleName: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => EntitiesToReEncryptDto)
  entities: EntitiesToReEncryptDto[];
}
