import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
@Index(['name', 'projectId'], { unique: true })
export class Namespace extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  parentId?: string;

  @Column({ type: 'varchar', update: false })
  projectId: string;
}
