import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigProvider } from 'src/shared/application/providers/EnvConfigProvider';

import { EnvConfigProviderImpl } from './EnvConfigProviderImpl';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: EnvConfigProvider, useClass: EnvConfigProviderImpl }],
})
export class EnvConfigModule {}
