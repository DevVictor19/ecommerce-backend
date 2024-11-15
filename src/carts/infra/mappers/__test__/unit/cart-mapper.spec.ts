import { Cart } from '@/carts/domain/entities/cart.entity';
import { CartDto } from '@/carts/infra/dtos/cart.dto';
import { CartMapper } from '@/carts/infra/mappers/cart.mapper';

describe('CartMapper', () => {
  it('should map a Cart entity to a CartDto', () => {
    const cart: Cart = {
      _id: 'cart-id',
      userId: 'user-id',
      products: [
        {
          _id: 'product-id',
          price: 100,
          name: 'Sample Product',
          description: 'A sample product description',
          photoUrl: 'http://example.com/photo.jpg',
          inCartQuantity: 2,
        },
      ],
      productsQuantity: 1,
      totalPrice: 200,
      createdAt: new Date(),
    };

    const result = CartMapper.toDto(cart);

    const expectedDto: CartDto = {
      id: 'cart-id',
      products: [
        {
          id: 'product-id',
          price: 100,
          name: 'Sample Product',
          description: 'A sample product description',
          photoUrl: 'http://example.com/photo.jpg',
          inCartQuantity: 2,
        },
      ],
      productsQuantity: 1,
      totalPrice: 200,
      createdAt: cart.createdAt.toISOString(),
    };

    expect(result).toEqual(expectedDto);
  });

  it('should map an empty Cart entity to a CartDto', () => {
    const cart: Cart = {
      _id: 'cart-id',
      userId: 'user-id',
      products: [],
      productsQuantity: 0,
      totalPrice: 0,
      createdAt: new Date(),
    };

    const result = CartMapper.toDto(cart);

    const expectedDto: CartDto = {
      id: 'cart-id',
      products: [],
      productsQuantity: 0,
      totalPrice: 0,
      createdAt: cart.createdAt.toISOString(),
    };

    expect(result).toEqual(expectedDto);
  });
});
