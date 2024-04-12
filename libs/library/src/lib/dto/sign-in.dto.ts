import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  projectName: string;
}

export class SignInAndVerifyChallengeDto extends SignInDto {
  @IsString()
  challenge: string;
}
