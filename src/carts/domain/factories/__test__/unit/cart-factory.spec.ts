import { faker } from '@faker-js/faker';

import { Cart } from '@/carts/domain/entities/cart.entity';
import { CartFactory } from '@/carts/domain/factories/cart.factory';

describe('CartFactory', () => {
  it('should create a Cart entity with default values and a given userId', () => {
    const userId = faker.database.mongodbObjectId();
    const cart = CartFactory.create(userId);

    expect(cart).toBeInstanceOf(Cart);
    expect(cart._id).toBeDefined();
    expect(cart.createdAt).toBeInstanceOf(Date);
    expect(cart.products).toEqual([]);
    expect(cart.productsQuantity).toBe(0);
    expect(cart.totalPrice).toBe(0);
    expect(cart.userId).toBe(userId);
  });
});
