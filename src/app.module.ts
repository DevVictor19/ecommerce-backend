import { Module } from '@nestjs/common';

import { AuthModule } from './auth/infra/auth.module';
import { DatabaseModule } from './shared/infra/database/database.module';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';
import { UsersModule } from './users/infra/users.module';

@Module({
  imports: [EnvConfigModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
