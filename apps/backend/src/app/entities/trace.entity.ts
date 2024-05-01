import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TraceI } from '@master-diploma/shared-resources';

@Entity()
export class Trace extends BaseEntity implements TraceI {
  @Column({ type: 'varchar', update: false })
  userId: string;

  @Column({ type: 'varchar', update: false })
  projectId: string;

  @Column({ type: 'varchar', update: false })
  url: string;

  @Column({ type: 'varchar', update: false })
  method: string;

  @Column({ type: 'varchar', update: false, nullable: true })
  body?: string;

  @Column({ type: 'varchar', update: false, nullable: true })
  query?: string;
}
