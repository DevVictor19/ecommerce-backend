import { Product } from '@/products/domain/entities/product.entity';
import { ProductDto } from '@/products/infra/dtos/product.dto';
import { ProductMapper } from '@/products/infra/mappers/product.mapper';

describe('ProductMapper', () => {
  it('should map a Product entity to a ProductDto', () => {
    const product: Product = {
      _id: '123',
      price: 100,
      name: 'Test Product',
      description: 'Test Description',
      photoUrl: 'http://example.com/photo.jpg',
      stockQuantity: 50,
      createdAt: new Date('2024-11-15T12:00:00Z'),
    };

    const dto: ProductDto = ProductMapper.toDto(product);

    expect(dto.id).toBe(product._id);
    expect(dto.price).toBe(product.price);
    expect(dto.name).toBe(product.name);
    expect(dto.description).toBe(product.description);
    expect(dto.photoUrl).toBe(product.photoUrl);
    expect(dto.stockQuantity).toBe(product.stockQuantity);
    expect(dto.createdAt).toBe(product.createdAt.toISOString());
  });
});
