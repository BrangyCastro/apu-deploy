import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

import { urlencoded, json } from 'express';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v3');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({ origin: '*' });
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Aceptación de solicitudes de origen "${serverConfig.origin}"`);
  }
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Aplicacion escuchando en el ${port}`);
}
bootstrap();
