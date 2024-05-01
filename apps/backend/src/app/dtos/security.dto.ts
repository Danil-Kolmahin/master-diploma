import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { TraceI } from '@master-diploma/shared-resources';
import { BaseEntityDto } from './base.dto';

export class TraceDto extends BaseEntityDto implements TraceI {
  @ApiProperty()
  @IsUUID(4)
  userId: string;

  @ApiProperty()
  @IsUUID(4)
  projectId: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  method: string;

  @ApiPropertyOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional()
  @IsString()
  query?: string;
}
