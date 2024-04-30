import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Challenge extends BaseEntity {
  @Column({ type: 'varchar', update: false })
  body: string;

  @Column({ type: 'timestamptz', update: false })
  expiresAt: Date;
}
