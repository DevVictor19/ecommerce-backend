import { CartDto } from '@/carts/infra/dtos/cart.dto';
import { CartProductMapper } from '@/carts/infra/mappers/cart-product.mapper';
import { OrderCart } from '@/orders/domain/entities/oder-cart.entity';
import { OrderCartMapper } from '@/orders/infra/mappers/order-cart.mapper';

describe('OrderCartMapper', () => {
  it('should map an OrderCart to a CartDto correctly', () => {
    const orderCart: OrderCart = {
      _id: 'order-cart-id',
      products: [
        {
          _id: 'product-id',
          name: 'Product 1',
          price: 100,
          description: 'A test product',
          photoUrl: 'https://example.com/photo.jpg',
          inCartQuantity: 2,
        },
      ],
      productsQuantity: 2,
      totalPrice: 200,
      createdAt: new Date('2024-11-16T12:00:00Z'), // Example fixed date for consistency
    };

    const cartDto: CartDto = {
      id: 'order-cart-id',
      products: [
        {
          id: 'product-id',
          name: 'Product 1',
          price: 100,
          description: 'A test product',
          photoUrl: 'https://example.com/photo.jpg',
          inCartQuantity: 2,
        },
      ],
      productsQuantity: 2,
      totalPrice: 200,
      createdAt: orderCart.createdAt.toISOString(),
    };

    jest.spyOn(CartProductMapper, 'toDto').mockImplementation((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      photoUrl: product.photoUrl,
      inCartQuantity: product.inCartQuantity,
    }));

    const result = OrderCartMapper.toDto(orderCart);

    expect(result).toEqual(cartDto);
  });
});
