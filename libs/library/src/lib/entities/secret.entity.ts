import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
@Index(['name', 'namespaceId'], { unique: true })
export class Secret extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  encryptedValue: string;

  @Column({ type: 'varchar' })
  namespaceId: string;

  @Column({ type: 'varchar', update: false })
  projectId: string;
}
