import { CartProduct } from '@/carts/domain/entities/cart-product.entity';
import { OrderCart } from '@/orders/domain/entities/oder-cart.entity';
import { OrderCartFactory } from '@/orders/domain/factories/order-cart.factory';

describe('OrderCartFactory', () => {
  it('should create an OrderCart entity with the correct properties', () => {
    const id = 'test-id';
    const products: CartProduct[] = [
      {
        _id: 'product-id',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        photoUrl: 'http://example.com/image.png',
        inCartQuantity: 2,
      },
    ];
    const productsQuantity = 2;
    const totalPrice = 200;
    const createdAt = new Date();

    const result = OrderCartFactory.create(
      id,
      products,
      productsQuantity,
      totalPrice,
      createdAt,
    );

    const expectedOrderCart: OrderCart = {
      _id: id,
      createdAt,
      products,
      productsQuantity,
      totalPrice,
    };

    expect(result).toEqual(expectedOrderCart);
    expect(result._id).toBe(id);
    expect(result.createdAt).toBe(createdAt);
    expect(result.products).toBe(products);
    expect(result.productsQuantity).toBe(productsQuantity);
    expect(result.totalPrice).toBe(totalPrice);
  });
});
