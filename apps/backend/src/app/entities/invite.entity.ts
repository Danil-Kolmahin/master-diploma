import { Column, Entity } from 'typeorm';
import { Challenge } from './challenge.entity';
import { InviteI } from '@master-diploma/shared-resources';

@Entity()
export class Invite extends Challenge implements InviteI {
  @Column({ type: 'varchar', update: false })
  email: string;

  @Column({ type: 'varchar', update: false })
  projectName: string;
}
