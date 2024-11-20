import { Injectable, NotFoundException } from '@nestjs/common';

import { CartService } from '@/carts/application/services/cart.service';
import { OrderFactory } from '@/orders/domain/factories/order.factory';
import { OrderCartFactory } from '@/orders/domain/factories/order-cart.factory';

import { OrderService } from '../services/order.service';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
  ) {}

  async execute(userId: string) {
    const cart = await this.cartService.findByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const orderCart = OrderCartFactory.create(
      cart._id,
      cart.products,
      cart.productsQuantity,
      cart.totalPrice,
      cart.createdAt,
    );

    const order = OrderFactory.create(userId, orderCart);

    await Promise.all([
      this.orderService.create(order),
      this.cartService.delete(cart._id),
    ]);

    return order;
  }
}
