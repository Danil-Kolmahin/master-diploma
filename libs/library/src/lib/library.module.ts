import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './services/projects.service';
import { Project } from './entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project]),
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [UsersService, AuthService, ProjectsService],
  exports: [UsersService, AuthService, ProjectsService],
})
export class LibraryModule {}
