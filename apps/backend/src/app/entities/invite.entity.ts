import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Invite extends BaseEntity {
  @Column({ type: 'varchar', update: false })
  body: string;

  @Column({ type: 'varchar', update: false })
  email: string;

  @Column({ type: 'varchar', update: false })
  projectName: string;

  @Column({ type: 'timestamptz', update: false })
  expiresAt: Date;
}
