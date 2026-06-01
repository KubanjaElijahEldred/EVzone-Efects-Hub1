import 'reflect-metadata';
import compression from 'compression';
import type { NextFunction, Request, Response } from 'express';
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
  const isProduction = (config.get<string>('NODE_ENV') || 'development') === 'production';
  const corsOrigin = config.get<string>('EVZONE_CORS_ORIGIN') || '*';
  const configuredOrigins = corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const exactAllowedOrigins = configuredOrigins.filter((origin) => !origin.includes('*'));
  const wildcardAllowedOrigins = configuredOrigins
    .filter((origin) => origin.includes('*'))
    .map((origin) => {
      const escapedOrigin = origin.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
      return new RegExp(`^${escapedOrigin}$`, 'i');
    });
  const localDevOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  const lanDevOriginPattern = /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/;
  const vercelPreviewOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

  app.setGlobalPrefix(prefix);
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers['access-control-request-private-network'] === 'true') {
      res.header('Access-Control-Allow-Private-Network', 'true');
    }
    next();
  });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsOrigin === '*') {
        callback(null, true);
        return;
      }
      const isExplicitlyAllowed = exactAllowedOrigins.includes(origin);
      const isWildcardAllowed = wildcardAllowedOrigins.some((pattern) => pattern.test(origin));
      const isLocalDevOrigin = !isProduction && localDevOriginPattern.test(origin);
      const isLanDevOrigin = !isProduction && lanDevOriginPattern.test(origin);
      const isVercelPreviewOrigin = !isProduction && vercelPreviewOriginPattern.test(origin);
      callback(null, isExplicitlyAllowed || isWildcardAllowed || isLocalDevOrigin || isLanDevOrigin || isVercelPreviewOrigin);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    optionsSuccessStatus: 204,
    credentials: false,
  });
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
