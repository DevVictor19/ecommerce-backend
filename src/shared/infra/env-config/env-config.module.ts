import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigProvider } from 'src/shared/application/providers/EnvConfigProvider';

import { EnvConfigProviderImpl } from './EnvConfigProviderImpl';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [{ provide: EnvConfigProvider, useClass: EnvConfigProviderImpl }],
  exports: [EnvConfigProvider],
})
export class EnvConfigModule {}
