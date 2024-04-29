import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDataI, COOKIE_NAME } from '@master-diploma/shared-resources';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies ? request.cookies[COOKIE_NAME] : undefined;
    if (!token) throw new UnauthorizedException();

    try {
      const payload: AuthDataI = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.authData = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
