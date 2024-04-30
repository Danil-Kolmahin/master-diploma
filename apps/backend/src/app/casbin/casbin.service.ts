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

  async changeUserRole(
    userId: string,
    roleName: string,
    projectId: string
  ): Promise<void> {
    await (this.enforcer as Enforcer).deleteRolesForUser(userId, projectId);
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

    const users = await this.usersService.findByIds(presumingUserIds);

    const enrichedUser = users.map((u) => ({
      ...u,
      roleName: (groupingPolicies.find(([id]) => id === u.id) as string[])[1],
    }));

    return enrichedUser;
  }

  async getAllRolesNames(projectId: string): Promise<string[]> {
    const policies = await (this.enforcer as Enforcer).getFilteredPolicy(
      3,
      projectId
    );

    const presumingRoles = [...new Set(policies.map(([id]) => id))];

    return [...presumingRoles, 'root'];
  }

  async addRole(
    roleName: string,
    projectId: string,
    policies: string[][]
  ): Promise<void> {
    for (const [object, action] of policies) {
      await (this.enforcer as Enforcer).addPolicy(
        roleName,
        object,
        action,
        projectId
      );
    }
  }

  async findRoleByName(
    roleName: string,
    projectId: string
  ): Promise<string[][]> {
    const policies = await (this.enforcer as Enforcer).getFilteredPolicy(
      0,
      roleName,
      '',
      '',
      projectId
    );

    return policies.map(([, object, action]) => [object, action]);
  }
}
