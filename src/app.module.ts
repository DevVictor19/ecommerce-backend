import { Module } from '@nestjs/common';

import { EnvConfigModule } from './shared/infra/env-config/env-config.module';

@Module({
  imports: [EnvConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
