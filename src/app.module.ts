import { Module } from '@nestjs/common';

import { AuthModule } from './auth/infra/auth.module';
import { CartsModule } from './carts/infra/carts.module';
import { OrdersModule } from './orders/infra/orders.module';
import { ProductsModule } from './products/infra/products.module';
import { DatabaseModule } from './shared/infra/database/database.module';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';
import { UsersModule } from './users/infra/users.module';

@Module({
  imports: [
    EnvConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CartsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
