import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, IsUUID } from 'class-validator';
import {
  AuthDataI,
  SignInAndVerifyChallengeDtoI,
} from '@master-diploma/shared-resources';
import { NewUserDto } from './members.dto';

export class AuthDataDto implements AuthDataI {
  @ApiProperty()
  @IsUUID(4)
  sub: string;

  @ApiProperty()
  @IsUUID(4)
  projectId: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  projectName: string;

  @ApiProperty()
  @IsNumber()
  iat: number;

  @ApiProperty()
  @IsNumber()
  exp: number;
}

export class SignInAndVerifyChallengeDto
  extends NewUserDto
  implements SignInAndVerifyChallengeDtoI
{
  @ApiProperty()
  @IsString()
  challenge: string;
}
