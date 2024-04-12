import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
    })
  );
  app.useStaticAssets(join(__dirname, 'assets'));
  app.setBaseViewsDir(join(__dirname, 'assets'));
  app.setViewEngine('hbs');
  app.use(cookieParser());
  const port = process.env.NODE_ENV === 'production' ? 80 : 3001;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
