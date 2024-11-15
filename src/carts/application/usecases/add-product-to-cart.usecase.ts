import { Injectable, NotFoundException } from '@nestjs/common';

import { CartFactory } from '@/carts/domain/factories/cart.factory';
import { CartProductFactory } from '@/carts/domain/factories/cart-product.factory';
import { ProductService } from '@/products/application/services/product.service';

import { CartService } from '../services/cart.service';

@Injectable()
export class AddProductToCartUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async execute(productId: string, userId: string, quantity: number) {
    const product = await this.productService.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const userCart = await this.cartService.findByUserId(userId);

    const cartProduct = CartProductFactory.create(
      product._id,
      product.price,
      product.name,
      product.description,
      product.photoUrl,
      quantity,
    );

    if (userCart) {
      this.cartService.addCartProduct(userCart, cartProduct);

      this.cartService.checkCartProductStockAvailability(userCart, product);

      await this.cartService.update(userCart);
    } else {
      const newCart = CartFactory.create(userId);

      this.cartService.addCartProduct(newCart, cartProduct);

      this.cartService.checkCartProductStockAvailability(newCart, product);

      await this.cartService.create(newCart);
    }
  }
}
