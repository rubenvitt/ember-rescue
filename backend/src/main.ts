import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
