import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const port = 5000;

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // This will remove any properties that are not defined in the DTO
      forbidNonWhitelisted: true, // This will throw an error if the request contains a property that is not defined in the DTO
      forbidUnknownValues: true, // This will throw an error if the request contains a property that is not defined in the DTO
      transform: true, // This will transform the request body to the DTO type
    }),
  );

  await app.listen(port, () => {
    Logger.log(`Server running at http://localhost:${port}/`);
  });
}

bootstrap();
