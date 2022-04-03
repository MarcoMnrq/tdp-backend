import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
//import * as csurf from 'csurf';
import * as requestIp from 'request-ip';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Security features
  app.enableCors({
    origin: ['http://localhost:3000'],
  });
  app.use(helmet());
  app.use(requestIp.mw());
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('TDP Backend')
    .setDescription('RESTful API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Start application
  await app.listen(3000);
}
bootstrap();
