import { SignInDto } from '@master-diploma/library';
import { IsEmail, IsString } from 'class-validator';

export class InviteDto extends SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  projectName: string;

  @IsString()
  roleName: string;
}
