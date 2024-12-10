import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, err) => {
          acc[err.property] = Object.values(err.constraints || {});
          return acc;
        }, {});

        return new UnprocessableEntityException(
          'Validation failed',
          formattedErrors,
        );
      },
    }),
  );

  const config = {
    ...new DocumentBuilder()
      .setTitle('Bluelight Hub Backend API')
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

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  const document = SwaggerModule.createDocument(app, config);
  document.servers = [
    { url: 'http://localhost:3000', description: 'Local Environment' },
    { url: 'https://ember-rescue.rubeen.dev', description: 'Dev Environment' },
  ];
  SwaggerModule.setup('api', app, document, {});
  if (process.env.AUTH_TOKEN) {
    logger.log('AUTH_TOKEN is required', process.env.AUTH_TOKEN);
  } else {
    logger.warn('AUTH_TOKEN is not required');
  }
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
