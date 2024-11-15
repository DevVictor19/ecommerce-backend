import { Product } from '@/products/domain/entities/product.entity';
import { ProductFactory } from '@/products/domain/factories/product.factory';

describe('ProductFactory', () => {
  it('should create a Product entity with correct properties', () => {
    const price = 1000;
    const name = 'Test Product';
    const description = 'This is a test product';
    const photoUrl = 'https://example.com/photo.jpg';
    const stockQuantity = 50;

    const product = ProductFactory.create(
      price,
      name,
      description,
      photoUrl,
      stockQuantity,
    );

    expect(product).toBeInstanceOf(Product);
    expect(product._id).toBeDefined();
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.price).toBe(price);
    expect(product.name).toBe(name);
    expect(product.description).toBe(description);
    expect(product.photoUrl).toBe(photoUrl);
    expect(product.stockQuantity).toBe(stockQuantity);
  });
});
