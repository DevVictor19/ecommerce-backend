import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/infra/products.module';

import { CartService } from '../application/services/cart.service';
import { AddProductToCartUseCase } from '../application/usecases/add-product-to-cart.usecase';
import { ClearCartUseCase } from '../application/usecases/clear-cart.usecase';
import { FindUserCartUseCase } from '../application/usecases/find-user-cart.usecase';
import { SubtractProductFromCartUseCase } from '../application/usecases/subtract-product-from-cart.usecase';
import { Cart, CartSchema } from '../domain/entities/cart.entity';
import { CartRepository } from '../domain/repositories/cart.repository';
import { CartController } from './controllers/cart.controller';
import { MongoCartRepository } from './repositories/mongo-cart.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule,
  ],
  providers: [
    { provide: CartRepository, useClass: MongoCartRepository },
    CartService,
    AddProductToCartUseCase,
    ClearCartUseCase,
    FindUserCartUseCase,
    SubtractProductFromCartUseCase,
  ],
  controllers: [CartController],
  exports: [CartService],
})
export class CartsModule {}
