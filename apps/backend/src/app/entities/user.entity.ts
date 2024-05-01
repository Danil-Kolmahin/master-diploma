import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserI } from '@master-diploma/shared-resources';

@Entity()
export class User extends BaseEntity implements UserI {
  @Column({ type: 'varchar', update: false, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  publicKey: string;
}
