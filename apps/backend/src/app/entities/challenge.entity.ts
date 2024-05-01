import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ChallengeI } from '@master-diploma/shared-resources';

@Entity()
export class Challenge extends BaseEntity implements ChallengeI {
  @Column({ type: 'varchar', update: false })
  body: string;

  @Column({ type: 'timestamptz', update: false })
  expiresAt: Date;
}
