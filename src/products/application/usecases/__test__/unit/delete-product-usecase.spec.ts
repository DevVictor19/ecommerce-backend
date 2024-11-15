import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from '@/products/application/services/product.service';
import { DeleteProductUseCase } from '@/products/application/usecases/delete-product.usecase';
import { Product } from '@/products/domain/entities/product.entity';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductUseCase,
        {
          provide: ProductService,
          useValue: {
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<DeleteProductUseCase>(DeleteProductUseCase);
    productService = module.get(ProductService);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    const productId = 'non-existent-id';

    productService.findById.mockResolvedValue(null);

    await expect(useCase.execute(productId)).rejects.toThrow(NotFoundException);

    expect(productService.findById).toHaveBeenCalledWith(productId);
    expect(productService.delete).not.toHaveBeenCalled();
  });

  it('should delete product when it exists', async () => {
    const productId = 'existing-id';
    const mockProduct = { _id: productId } as Product;

    productService.findById.mockResolvedValue(mockProduct);

    await useCase.execute(productId);

    expect(productService.findById).toHaveBeenCalledWith(productId);
    expect(productService.delete).toHaveBeenCalledWith(productId);
  });
});
