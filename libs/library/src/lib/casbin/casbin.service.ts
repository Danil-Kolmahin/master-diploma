import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { newEnforcer, Enforcer } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';
import { Rule } from './casbin.entity';
import { DataSource } from 'typeorm';
import { writeFile } from 'fs/promises';
import model from './rbac.model';

@Injectable()
export class CasbinService implements OnApplicationBootstrap {
  private enforcer?: Enforcer;

  async onApplicationBootstrap() {
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.NODE_ENV === 'production' ? 'database' : 'localhost',
      username: 'dev',
      password: process.env.DATABASE_PASSWORD,
      database: 'master-diploma',
      entities: [Rule],
      synchronize: true,
    });

    const adapter = await TypeORMAdapter.newAdapter(
      { connection: dataSource },
      { customCasbinRuleEntity: Rule }
    );
    await writeFile('./rbac_model.conf', model);
    this.enforcer = await newEnforcer('./rbac_model.conf', adapter);
  }

  async enforce(sub: string, obj: string, act: string): Promise<boolean> {
    return (this.enforcer as Enforcer).enforce(sub, obj, act);
  }

  async addPolicy(sub: string, obj: string, act: string): Promise<void> {
    await (this.enforcer as Enforcer).addPolicy(sub, obj, act);
  }

  async addRoleForUser(user: string, role: string): Promise<void> {
    await (this.enforcer as Enforcer).addRoleForUser(user, role);
  }
}
