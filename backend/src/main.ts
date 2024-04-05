import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as cors from 'cors'
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();
  app.useGlobalPipes(new ValidationPipe());
  app.use('/uploads/news', express.static('uploads/news'));
  app.use(cors());
  app.use(bodyParser.json());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
