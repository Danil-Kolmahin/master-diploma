import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', update: false, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  publicKey: string;
}
