import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LibraryModule } from '@master-diploma/library';

import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { NamespacesController } from './controllers/namespaces.controller';
import { SecretsController } from './controllers/secrets.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
  ],
  controllers: [
    AppController,
    AuthController,
    NamespacesController,
    SecretsController,
    PermissionsController,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
