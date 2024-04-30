import { IsString } from 'class-validator';
import { SignInDto } from './sign-in.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto extends SignInDto {
  @ApiProperty()
  @IsString()
  publicKey: string;
}
