import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { ProjectsService } from './projects.service';
import { CasbinService } from '../casbin/casbin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private readonly jwtService: JwtService,
    private readonly casbinService: CasbinService
  ) {}

  async signIn(email: string, projectName: string): Promise<string> {
    const user = await this.usersService.findOneByEmail(email);
    const project = await this.projectsService.findOneByName(projectName);
    if (!user || !project) throw new UnauthorizedException();

    const hasRoleInProject = await this.casbinService.hasRoleInProject(
      user.id,
      project.id
    );
    if (!hasRoleInProject) throw new UnauthorizedException();

    const payload = { sub: user.id, projectId: project.id, email, projectName };
    return this.jwtService.signAsync(payload);
  }
}
