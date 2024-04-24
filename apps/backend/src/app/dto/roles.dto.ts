import { IsArray, IsString } from 'class-validator';

export class AddRoleDto {
  @IsString()
  roleName: string;

  @IsArray()
  policies: any[];
}
