import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { Logger, ValidationPipe } from '@nestjs/common';
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
    }),
  );
  const config = {
    ...new DocumentBuilder()
      .setTitle('Project Rescue Backend API')
      .setVersion('0.0.1-alpha')
      .build(),
  };
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
