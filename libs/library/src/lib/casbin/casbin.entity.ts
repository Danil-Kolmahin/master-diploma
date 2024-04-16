import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { CasbinRule } from 'typeorm-adapter';

@Entity()
export class Rule extends CasbinRule {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
