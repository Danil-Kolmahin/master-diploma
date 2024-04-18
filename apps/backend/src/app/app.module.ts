import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LibraryModule } from '@master-diploma/library';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { NamespacesController } from './controllers/namespaces.controller';
import { SecretsController } from './controllers/secrets.controller';

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
  ],
  controllers: [
    AppController,
    AuthController,
    NamespacesController,
    SecretsController,
  ],
  providers: [AppService],
})
export class AppModule {}
