import dotenv from 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //
  await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: 6379,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('MKS')
    .setDescription('A CRUD API developed using Typescript')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
