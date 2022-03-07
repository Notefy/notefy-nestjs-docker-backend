import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(helmet())
  // app.use(helmet.noSniff())
  // app.use(helmet.hideppoweredBy())
  // app.use(helmet.contentSecurityPolicy())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // SwaggerModule.setup('api/v2', app, createDocument(app));
  await app.listen(3000);
}
bootstrap();
