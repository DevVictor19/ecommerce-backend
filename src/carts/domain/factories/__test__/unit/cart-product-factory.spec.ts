import { faker } from '@faker-js/faker';

import { CartProduct } from '@/carts/domain/entities/cart-product.entity';
import { CartProductFactory } from '@/carts/domain/factories/cart-product.factory';

describe('CartProductFactory', () => {
  it('should create a CartProduct entity with the provided values', () => {
    const id = faker.database.mongodbObjectId();
    const price = faker.number.int({ min: 100, max: 100000 }); // Price in cents
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const photoUrl = faker.internet.url();
    const inCartQuantity = faker.number.int({ min: 1, max: 10 }); // Minimum quantity is 1

    const cartProduct = CartProductFactory.create(
      id,
      price,
      name,
      description,
      photoUrl,
      inCartQuantity,
    );

    expect(cartProduct).toBeInstanceOf(CartProduct);
    expect(cartProduct._id).toBe(id);
    expect(cartProduct.price).toBe(price);
    expect(cartProduct.name).toBe(name);
    expect(cartProduct.description).toBe(description);
    expect(cartProduct.photoUrl).toBe(photoUrl);
    expect(cartProduct.inCartQuantity).toBe(inCartQuantity);
  });
});
