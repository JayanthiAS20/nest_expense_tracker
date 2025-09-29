import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  app.useLogger(app.get(ConfigService).get('LOG').split(','));

  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NestJS_API')
      .setDescription('Diffusion APIs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document, {
      jsonDocumentUrl: 'api/json-spec',
      yamlDocumentUrl: 'api/yaml-spec',
      customSiteTitle: 'API DOCS',
    });
  }

  app.use(helmet());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application running on : ${await app.getUrl()}`);
}
bootstrap();
