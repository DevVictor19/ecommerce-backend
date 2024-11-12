import { Injectable, NotFoundException } from '@nestjs/common';

import { CartService } from '../services/cart.service';

@Injectable()
export class SubtractProductFromCartUseCase {
  constructor(private readonly cartService: CartService) {}

  async execute(productId: string, userId: string, quantity: number) {
    const cart = await this.cartService.findByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    this.cartService.subtractCartProduct(cart, productId, quantity);

    if (cart.productsQuantity === 0) {
      await this.cartService.delete(cart._id);
      return;
    }

    this.cartService.update(cart);
  }
}
