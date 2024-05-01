import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsUUID } from 'class-validator';
import { BaseEntityI } from '@master-diploma/shared-resources';

export class BaseEntityDto implements BaseEntityI {
  @ApiProperty()
  @IsUUID(4)
  id: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional()
  @IsDate()
  updatedAt?: Date;
}
