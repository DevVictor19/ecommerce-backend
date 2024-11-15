import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from '@/products/application/services/product.service';
import { FindProductByIdUseCase } from '@/products/application/usecases/find-product-by-id.usecase';
import { Product } from '@/products/domain/entities/product.entity';

describe('FindProductByIdUseCase', () => {
  let useCase: FindProductByIdUseCase;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProductByIdUseCase,
        {
          provide: ProductService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindProductByIdUseCase>(FindProductByIdUseCase);
    productService = module.get(ProductService);
  });

  it('should return the product if it exists', async () => {
    const productId = 'valid-product-id';
    const mockProduct = {
      _id: productId,
      name: 'Product A',
      price: 100,
      description: 'Description A',
      photoUrl: 'http://example.com/photo.jpg',
      stockQuantity: 10,
      createdAt: new Date(),
    } as Product;

    productService.findById.mockResolvedValue(mockProduct);

    const result = await useCase.execute(productId);

    expect(productService.findById).toHaveBeenCalledWith(productId);
    expect(result).toEqual(mockProduct);
  });

  it('should throw NotFoundException if the product does not exist', async () => {
    const productId = 'invalid-product-id';

    productService.findById.mockResolvedValue(null);

    await expect(useCase.execute(productId)).rejects.toThrow(
      new NotFoundException('Product not found'),
    );

    expect(productService.findById).toHaveBeenCalledWith(productId);
  });
});
