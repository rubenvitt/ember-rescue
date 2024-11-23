import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';

const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // FIXME: This should probable be changed: 🙂
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  const config = {
    ...new DocumentBuilder()
      .setTitle('Project Rescue Backend API')
      .setVersion(process.env.VERSION || 'unknown')
      .addApiKey(
        {
          type: 'apiKey',
          in: 'header',
          name: 'bearbeiter',
          description: 'Aktuell eingeloggter Bearbeiter (einfacher Name)',
        },
        'Bearbeiter',
      )
      .build(),
  };

  // TODO:
  // app.enableVersioning({
  //   key: 'api-version=',
  //   type: VersioningType.MEDIA_TYPE,
  //   defaultVersion: '1',
  // });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {});
  if (process.env.AUTH_TOKEN) {
    logger.log('AUTH_TOKEN is required', process.env.AUTH_TOKEN);
  } else {
    logger.warn('AUTH_TOKEN is not required');
  }
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
