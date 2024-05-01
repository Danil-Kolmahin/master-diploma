import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  MembersDtoI,
  NewUserDtoI,
  SignUpDtoI,
} from '@master-diploma/shared-resources';
import { BaseEntityDto } from './base.dto';

export class NewUserDto implements NewUserDtoI {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  projectName: string;
}

export class SignUpDto extends NewUserDto implements SignUpDtoI {
  @ApiProperty()
  @IsString()
  publicKey: string;
}

export class MembersDto extends BaseEntityDto implements MembersDtoI {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  publicKey: string;

  @ApiProperty()
  @IsString()
  roleName: string;
}
