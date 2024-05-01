import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NamespaceI } from '@master-diploma/shared-resources';

@Entity()
@Index(['name', 'projectId'], { unique: true })
export class Namespace extends BaseEntity implements NamespaceI {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  parentId?: string;

  @Column({ type: 'varchar', update: false })
  projectId: string;
}
