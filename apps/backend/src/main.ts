import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import nocache from 'nocache';
import { join } from 'path';

import { COOKIE_NAME } from '@master-diploma/shared-resources';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const SITE_URL = 'ideal-octo-chainsaw.xyz';

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", SITE_URL],
          styleSrc: ["'self'", SITE_URL, "'sha256-abc123'"],
          imgSrc: ["'self'", SITE_URL],
        },
      },
      frameguard: { action: 'deny' },
      xPoweredBy: false,
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xContentTypeOptions: false,
    })
  );
  app.use(nocache());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
    })
  );
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, 'assets'));
  app.setBaseViewsDir(join(__dirname, 'assets'));

  const config = new DocumentBuilder()
    .setTitle('SMS API')
    .setVersion(process.env.npm_package_version || 'vx.x.x')
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
