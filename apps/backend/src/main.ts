import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { COOKIE_NAME } from '@master-diploma/shared-resources';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
    })
  );
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('SMS API')
    .addCookieAuth(COOKIE_NAME)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'SMS API',
  });

  const port = process.env.NODE_ENV === 'production' ? 80 : 3001;

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
