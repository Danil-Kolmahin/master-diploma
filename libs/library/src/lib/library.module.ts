import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './services/projects.service';
import { Project } from './entities/project.entity';
import { Challenge } from './entities/challenge.entity';
import { ChallengesService } from './services/challenge.service';
import { Invite } from './entities/invite.entity';
import { InvitesService } from './services/invites.service';
import { CasbinService } from './casbin/casbin.service';
import { Rule } from './casbin/casbin.entity';
import { Namespace } from './entities/namespace.entity';
import { Secret } from './entities/secret.entity';
import { NamespacesService } from './services/namespaces.service';
import { SecretsService } from './services/secrets.service';
import { SecurityKey } from './entities/security-key.entity';
import { SecurityKeysService } from './services/security-key.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Project,
      Challenge,
      Invite,
      Rule,
      Namespace,
      Secret,
      SecurityKey,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [
    UsersService,
    AuthService,
    ProjectsService,
    ChallengesService,
    InvitesService,
    CasbinService,
    NamespacesService,
    SecretsService,
    SecurityKeysService,
  ],
  exports: [
    UsersService,
    AuthService,
    ProjectsService,
    ChallengesService,
    InvitesService,
    CasbinService,
    NamespacesService,
    SecretsService,
    SecurityKeysService,
  ],
})
export class LibraryModule {}
