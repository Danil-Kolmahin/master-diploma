import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
@Index(['name', 'projectId'], { unique: true })
export class Secret extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'bytea' })
  encryptedValue: Buffer;

  @Column({ type: 'varchar' })
  namespaceId: string;

  @Column({ type: 'varchar', update: false })
  projectId: string;
}
