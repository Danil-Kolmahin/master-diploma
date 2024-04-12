import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Challenge extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  body: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;
}
