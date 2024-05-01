import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProjectI } from '@master-diploma/shared-resources';

@Entity()
export class Project extends BaseEntity implements ProjectI {
  @Column({ type: 'varchar', unique: true })
  name: string;
}
