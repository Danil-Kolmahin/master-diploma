import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  projectName: string;
}

export class SignInAndVerifyChallengeDto extends SignInDto {
  @ApiProperty()
  @IsString()
  challenge: string;
}
