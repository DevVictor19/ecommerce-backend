import { CartProduct } from '@/carts/domain/entities/cart-product.entity';
import { CartProductDto } from '@/carts/infra/dtos/cart-product.dto';
import { CartProductMapper } from '@/carts/infra/mappers/cart-product.mapper';

describe('CartProductMapper', () => {
  it('should map a CartProduct entity to a CartProductDto', () => {
    const cartProduct: CartProduct = {
      _id: 'product-id',
      price: 100,
      name: 'Sample Product',
      description: 'A sample product description',
      photoUrl: 'http://example.com/photo.jpg',
      inCartQuantity: 2,
    };

    const result = CartProductMapper.toDto(cartProduct);

    const expectedDto: CartProductDto = {
      id: 'product-id',
      price: 100,
      name: 'Sample Product',
      description: 'A sample product description',
      photoUrl: 'http://example.com/photo.jpg',
      inCartQuantity: 2,
    };

    expect(result).toEqual(expectedDto);
  });
});
