import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SecurityKeyI } from '@master-diploma/shared-resources';

@Entity()
export class SecurityKey extends BaseEntity implements SecurityKeyI {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  entityId: string;

  @Column({ type: 'varchar' })
  encryptedKey: string;

  @Column({ type: 'varchar' })
  projectId: string;
}
