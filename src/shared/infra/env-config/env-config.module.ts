import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvConfigProvider } from '@/shared/application/providers/env-config-provider.contract';

import { EnvConfigProviderImpl } from './env-config.provider';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [{ provide: EnvConfigProvider, useClass: EnvConfigProviderImpl }],
  exports: [EnvConfigProvider],
})
export class EnvConfigModule {}
