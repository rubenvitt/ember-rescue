import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError as ClassValidatorError } from 'class-validator';
import * as process from 'node:process';
import { AppModule } from './app.module';

const logger = new Logger('main.ts');

function formatValidationError(errors: ClassValidatorError[]): string[] {
  return errors.reduce((acc: string[], error: ClassValidatorError) => {
    if (!error.property && error.constraints?.unknownValue) {
      acc.push('Die übergebenen Daten sind ungültig. Bitte überprüfen Sie das Format der Daten.');
      return acc;
    }

    if (error.constraints) {
      const fieldErrors = Object.values(error.constraints).map(
        (message) => `${error.property}: ${message}`
      );
      acc.push(...fieldErrors);
    }

    if (error.children?.length) {
      const childErrors = formatValidationError(error.children).map(
        (childError) => `${error.property}.${childError}`
      );
      acc.push(...childErrors);
    }

    return acc;
  }, []);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  // FIXME: This should probable be changed: 🤔
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => {
        const formattedErrors = formatValidationError(errors);

        if (!formattedErrors.length) {
          formattedErrors.push('Die übergebenen Daten sind ungültig. Bitte überprüfen Sie das Format der Daten.');
        }

        const fields = errors.map((error) => ({
          field: error.property || 'unknown',
          value: error.value,
          constraints: error.constraints || {},
        }));

        const details = errors.map(error => ({
          property: error.property || 'unknown',
          messages: error.constraints
            ? Object.values(error.constraints)
            : ['Ungültiges Datenformat']
        }));

        throw new UnprocessableEntityException({
          message: 'Validierung fehlgeschlagen',
          errors: formattedErrors,
          fields,
          details
        });
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
