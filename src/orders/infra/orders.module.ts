import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CartsModule } from '@/carts/infra/carts.module';

import { OrderService } from '../application/services/order.service';
import { CancelOrderUseCase } from '../application/usecases/cancel-order.usecase';
import { CreateOrderUseCase } from '../application/usecases/create-order.usecase';
import { FindAllOrdersUseCase } from '../application/usecases/find-all-orders.usecase';
import { FindAllUserOrdersUseCase } from '../application/usecases/find-all-user-orders.usecase';
import { FindOrderByIdUseCase } from '../application/usecases/find-order-by-id.usecase';
import { Order, OrderSchema } from '../domain/entities/order.entity';
import { OrderRepository } from '../domain/repositories/order.repository';
import { OrderController } from './controllers/order.controller';
import { MongoOrderRepository } from './repositories/mongo-order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartsModule,
  ],
  providers: [
    { provide: OrderRepository, useClass: MongoOrderRepository },
    OrderService,
    CancelOrderUseCase,
    CreateOrderUseCase,
    FindAllOrdersUseCase,
    FindAllUserOrdersUseCase,
    FindOrderByIdUseCase,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrdersModule {}
