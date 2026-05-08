import 'reflect-metadata';
import compression from 'compression';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const prefix = config.get<string>('API_PREFIX') || 'api/v1';
  const corsOrigin = config.get<string>('EVZONE_CORS_ORIGIN') || '*';

  app.setGlobalPrefix(prefix);
  app.enableCors({ origin: corsOrigin === '*' ? true : corsOrigin.split(','), credentials: false });
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new ResponseEnvelopeInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EVzone Effect Hub Backend')
    .setDescription('NestJS API for the EVzone AR/effect creator platform. No auth, no billing, no marketplace endpoints.')
    .setVersion('1.0.0')
    .addTag('EVzone')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, { jsonDocumentUrl: 'docs-json' });

  const port = Number(config.get<string>('PORT') || 3777);
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`EVzone Effect Hub backend running on http://localhost:${port}/${prefix}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger docs available on http://localhost:${port}/docs`);
}

void bootstrap();
