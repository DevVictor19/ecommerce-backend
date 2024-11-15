import { faker } from '@faker-js/faker/.';

import { Cart } from '@/carts/domain/entities/cart.entity';
import { CartProduct } from '@/carts/domain/entities/cart-product.entity';

export function createCartEntity(props?: Partial<Cart>): Cart {
  const cart = new Cart();

  cart._id = props?._id ?? faker.database.mongodbObjectId();
  cart.createdAt = props?.createdAt ?? new Date();
  cart.products = props?.products ?? [];
  cart.productsQuantity = props?.productsQuantity ?? 0;
  cart.totalPrice = props?.totalPrice ?? 0;
  cart.userId = props?.userId ?? faker.database.mongodbObjectId();

  return cart;
}

export function createCartProductEntity(
  props?: Partial<CartProduct>,
): CartProduct {
  const cartProduct = new CartProduct();

  cartProduct._id = props?._id ?? faker.database.mongodbObjectId();
  cartProduct.description = props?.description ?? faker.word.words(5);
  cartProduct.inCartQuantity = props?.inCartQuantity ?? 0;
  cartProduct.name = props?.name ?? faker.internet.username();
  cartProduct.photoUrl = props?.photoUrl ?? faker.internet.url();
  cartProduct.price = props?.price ?? 0;

  return cartProduct;
}
