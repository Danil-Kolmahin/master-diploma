import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class SecurityKey extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  entityId: string;

  @Column({ type: 'varchar' })
  encryptedKey: string;

  @Column({ type: 'varchar' })
  projectId: string;
}
