import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Cart } from '@/carts/domain/entities/cart.entity';
import { CartProduct } from '@/carts/domain/entities/cart-product.entity';
import { CartRepository } from '@/carts/domain/repositories/cart.repository';
import { Product } from '@/products/domain/entities/product.entity';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async create(cart: Cart) {
    await this.cartRepository.insert(cart);
  }

  async update(cart: Cart) {
    await this.cartRepository.update(cart._id, {
      products: cart.products,
      totalPrice: cart.totalPrice,
      productsQuantity: cart.productsQuantity,
    });
  }

  findByUserId(userId: string) {
    return this.cartRepository.findByUserId(userId);
  }

  async delete(cartId: string) {
    await this.cartRepository.delete(cartId);
  }

  addCartProduct(cart: Cart, product: CartProduct) {
    if (product.inCartQuantity <= 0) {
      throw new BadRequestException('Quantity to add must be a positive value');
    }

    const existingProduct = cart.products.find((p) => p._id === product._id);

    if (existingProduct) {
      existingProduct.inCartQuantity += product.inCartQuantity;
    } else {
      cart.products.push(product);
    }

    const priceToAdd = product.price * product.inCartQuantity;

    if (priceToAdd <= 0) {
      throw new BadRequestException('Price to add must be a positive value');
    }

    cart.totalPrice += priceToAdd;

    if (product.inCartQuantity <= 0) {
      throw new BadRequestException('Quantity to add must be a positive value');
    }

    if (cart.productsQuantity + product.inCartQuantity > 30) {
      throw new BadRequestException(
        'Quantity to add must not pass the maximum cart capacity',
      );
    }

    cart.productsQuantity += product.inCartQuantity;
  }

  subtractCartProduct(cart: Cart, productId: string, quantityToSub: number) {
    const existingProduct = cart.products.find((p) => p._id === productId);

    if (!existingProduct) {
      throw new NotFoundException('Product not present in cart');
    }

    if (existingProduct.inCartQuantity - quantityToSub < 0) {
      throw new BadRequestException(
        'In cart quantity cannot be less than zero',
      );
    }

    existingProduct.inCartQuantity -= quantityToSub;

    if (existingProduct.inCartQuantity === 0) {
      cart.products = cart.products.filter((p) => p._id !== productId);
    }

    const priceToSubtract = existingProduct.price * quantityToSub;

    if (cart.totalPrice - priceToSubtract < 0) {
      throw new BadRequestException('Total price cannot be less than zero');
    }

    cart.totalPrice -= priceToSubtract;

    if (cart.productsQuantity - quantityToSub < 0) {
      throw new BadRequestException(
        'Quantity to subtract must not pass the minimum cart capacity',
      );
    }

    cart.productsQuantity -= quantityToSub;
  }

  checkCartProductStockAvailability(cart: Cart, stockProduct: Product) {
    const cartProduct = cart.products.find((p) => p._id === stockProduct._id);

    if (!cartProduct) {
      throw new NotFoundException('Product not present in cart');
    }

    if (cartProduct.inCartQuantity > stockProduct.stockQuantity) {
      throw new BadRequestException(
        'Insufficient quantity of product in stock to add',
      );
    }
  }
}
