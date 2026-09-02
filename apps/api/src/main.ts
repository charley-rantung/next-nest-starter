import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { ExceptionHandlerFilter } from './common/filter/exception-handler.filter';
import { RequestIdInterceptor } from './common/interceptor/request-id.interceptor';
import Helmet from 'helmet';
import CookieParser from 'cookie-parser';
import type { EnvType } from './common/utils/env.utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  });
  const config = app.get(ConfigService<EnvType, true>);

  const PORT = config.get('APP_PORT', { infer: true });
  const HOST = config.get('APP_HOST', { infer: true });
  const ORIGINS = config.get('CORS_ALLOWED_ORIGIN', { infer: true }).split('|');

  app.setGlobalPrefix('api/v1');
  app.set('trust proxy', 'loopback');
  app.enableCors({
    origin: ORIGINS,
    credentials: true,
  });
  app.use(Helmet());
  app.use(CookieParser());
  app.useGlobalFilters(new ExceptionHandlerFilter());
  app.useGlobalInterceptors(new RequestIdInterceptor());

  await app.listen(PORT, HOST, () => {
    console.info(`🚀 Server running on ${HOST}:${PORT}`);
  });
}
bootstrap().catch(() => {});
