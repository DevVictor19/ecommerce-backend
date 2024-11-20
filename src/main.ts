import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { JwtProvider } from './auth/application/providers/jwt-provider.contract';
import { AuthGuard } from './auth/infra/guards/auth.guard';
import { RolesGuard } from './auth/infra/guards/roles.guard';
import { EnvConfigProvider } from './shared/application/providers/env-config-provider.contract';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      whitelist: true,
      transform: true,
    }),
  );

  // enable global authentication and authorization for all routes
  app.useGlobalGuards(
    new AuthGuard(app.get(JwtProvider), app.get(Reflector)),
    new RolesGuard(app.get(Reflector)),
  );

  app.enableCors({
    origin: app.get(EnvConfigProvider).getServerFrontendUrl(),
    allowedHeaders: '*',
    methods: '*',
  });

  await app.listen(app.get(EnvConfigProvider).getServerPort(), '0.0.0.0');
}
bootstrap();
