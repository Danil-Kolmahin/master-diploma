import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditInterceptor, LibraryModule } from '@master-diploma/library';
import { SystemController } from './controllers/system.controller';
import { AuthController } from './controllers/auth.controller';
import { NamespacesController } from './controllers/namespaces.controller';
import { SecretsController } from './controllers/secrets.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import {
  REQUEST_RATE_LIMIT,
  REQUEST_RATE_TTL,
} from '@master-diploma/shared-resources';

@Module({
  imports: [
    LibraryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.NODE_ENV === 'production' ? 'database' : 'localhost',
      username: 'dev',
      password: process.env.DATABASE_PASSWORD,
      database: 'master-diploma',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot([
      { ttl: REQUEST_RATE_TTL, limit: REQUEST_RATE_LIMIT },
    ]),
  ],
  controllers: [
    SystemController,
    AuthController,
    NamespacesController,
    SecretsController,
    PermissionsController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
