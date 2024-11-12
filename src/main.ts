import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { EnvConfigProvider } from './shared/application/providers/env-config-provider.contract';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const envConfigProvider = app.get(EnvConfigProvider);
  await app.listen(envConfigProvider.getServerPort());
}
bootstrap();
