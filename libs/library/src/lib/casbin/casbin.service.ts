import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { newEnforcer, Enforcer } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';
import { Rule } from './casbin.entity';
import { DataSource } from 'typeorm';
import { writeFile } from 'fs/promises';
import model from './rbac.model';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Injectable()
export class CasbinService implements OnApplicationBootstrap {
  private enforcer?: Enforcer;

  constructor(private readonly usersService: UsersService) {}

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

  async enforce(
    userId: string,
    object: string,
    action: string,
    projectId: string
  ): Promise<boolean> {
    return (this.enforcer as Enforcer).enforce(
      userId,
      object,
      action,
      projectId
    );
  }

  async addPolicy(
    userId: string,
    object: string,
    action: string,
    projectId: string
  ): Promise<void> {
    await (this.enforcer as Enforcer).addPolicy(
      userId,
      object,
      action,
      projectId
    );
  }

  async addRoleForUser(
    userId: string,
    roleName: string,
    projectId: string
  ): Promise<void> {
    await (this.enforcer as Enforcer).addRoleForUser(
      userId,
      roleName,
      projectId
    );
  }

  async hasRoleInProject(userId: string, projectId: string): Promise<boolean> {
    const roles = await (this.enforcer as Enforcer).getRolesForUserInDomain(
      userId,
      projectId
    );
    return Boolean(roles.length);
  }

  async findUsersInProject(projectId: string): Promise<User[]> {
    const groupingPolicies = await (
      this.enforcer as Enforcer
    ).getFilteredGroupingPolicy(2, projectId);

    const presumingUserIds = [...groupingPolicies.map(([id]) => id)];

    return this.usersService.findByIds(presumingUserIds);
  }
}
