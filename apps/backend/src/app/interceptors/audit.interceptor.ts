import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { TracesService } from '../services/traces.service';
import { Observable, tap } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { COOKIE_NAME } from '@master-diploma/shared-resources';
import { Response } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly tracesService: TracesService,
    private readonly jwtService: JwtService
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response> {
    return next.handle().pipe(
      tap(async () => {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies
          ? request.cookies[COOKIE_NAME]
          : undefined;
        if (!token) return;

        const { sub, projectId } = await this.jwtService.decode(token);

        await this.tracesService.insert(
          sub,
          projectId,
          request.protocol +
            '://' +
            request.get('host') +
            request.originalUrl.split('?').shift(),
          request.method,
          JSON.stringify(request.body),
          JSON.stringify(request.query)
        );
      })
    );
  }
}
