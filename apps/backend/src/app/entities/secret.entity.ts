import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SecretI } from '@master-diploma/shared-resources';

@Entity()
@Index(['name', 'namespaceId'], { unique: true })
export class Secret extends BaseEntity implements SecretI {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  encryptedValue: string;

  @Column({ type: 'varchar' })
  namespaceId: string;

  @Column({ type: 'varchar', update: false })
  projectId: string;
}
