import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

import {
  ACCESS_TIME,
  REQUEST_RATE_LIMIT,
  REQUEST_RATE_TTL,
} from '@master-diploma/shared-resources';

import { SystemController } from './controllers/system.controller';
import { AuthController } from './controllers/auth.controller';
import { NamespacesController } from './controllers/namespaces.controller';
import { SecretsController } from './controllers/secrets.controller';
import { RolesController } from './controllers/roles.controller';
import { SecurityController } from './controllers/security.controller';
import { MembersController } from './controllers/members.controller';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Challenge } from './entities/challenge.entity';
import { Invite } from './entities/invite.entity';
import { Rule } from './entities/casbin.entity';
import { Namespace } from './entities/namespace.entity';
import { Secret } from './entities/secret.entity';
import { SecurityKey } from './entities/security-key.entity';
import { Trace } from './entities/trace.entity';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { ProjectsService } from './services/projects.service';
import { ChallengesService } from './services/challenge.service';
import { InvitesService } from './services/invites.service';
import { CasbinService } from './services/casbin.service';
import { NamespacesService } from './services/namespaces.service';
import { SecretsService } from './services/secrets.service';
import { SecurityKeysService } from './services/security-key.service';
import { TracesService } from './services/traces.service';
import { AuditInterceptor } from './interceptors/audit.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NODE_ENV === 'production' ? 'database' : 'localhost',
      username: 'dev',
      password: process.env.DATABASE_PASSWORD,
      database: 'master-diploma',
      synchronize: true,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: ACCESS_TIME },
    }),
    ThrottlerModule.forRoot([
      { ttl: REQUEST_RATE_TTL, limit: REQUEST_RATE_LIMIT },
    ]),
    TypeOrmModule.forFeature([
      User,
      Project,
      Challenge,
      Invite,
      Rule,
      Namespace,
      Secret,
      SecurityKey,
      Trace,
    ]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    UsersService,
    AuthService,
    ProjectsService,
    ChallengesService,
    InvitesService,
    CasbinService,
    NamespacesService,
    SecretsService,
    SecurityKeysService,
    TracesService,
  ],
  controllers: [
    SystemController,
    AuthController,
    NamespacesController,
    SecretsController,
    RolesController,
    SecurityController,
    MembersController,
  ],
})
export class AppModule {}
