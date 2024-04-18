import { IsString, IsUUID, IsOptional } from 'class-validator';

export class NamespaceDto {
  @IsString()
  name: string;

  @IsUUID(4)
  @IsOptional()
  parentId?: string;
}
