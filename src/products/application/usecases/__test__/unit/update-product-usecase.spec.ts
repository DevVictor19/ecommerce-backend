import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from '@/products/application/services/product.service';
import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;

  const mockProductService = {
    findByName: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    useCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the product successfully if no duplicate name exists', async () => {
    mockProductService.findByName.mockResolvedValue(null);
    mockProductService.update.mockResolvedValue(undefined);

    await expect(
      useCase.execute(
        'product-id',
        100,
        'New Product',
        'Product description',
        'https://example.com/image.jpg',
        10,
      ),
    ).resolves.not.toThrow();

    expect(mockProductService.findByName).toHaveBeenCalledWith('New Product');
    expect(mockProductService.update).toHaveBeenCalledWith('product-id', {
      price: 100,
      name: 'New Product',
      description: 'Product description',
      photoUrl: 'https://example.com/image.jpg',
      stockQuantity: 10,
    });
  });

  it('should throw BadRequestException if product name already exists', async () => {
    mockProductService.findByName.mockResolvedValue({
      _id: 'different-product-id',
      name: 'New Product',
    });

    await expect(
      useCase.execute(
        'product-id',
        100,
        'New Product',
        'Product description',
        'https://example.com/image.jpg',
        10,
      ),
    ).rejects.toThrow(BadRequestException);

    expect(mockProductService.findByName).toHaveBeenCalledWith('New Product');
    expect(mockProductService.update).not.toHaveBeenCalled();
  });

  it('should not throw an error if the existing product with the same name is the one being updated', async () => {
    mockProductService.findByName.mockResolvedValue({
      _id: 'product-id',
      name: 'Existing Product',
    });
    mockProductService.update.mockResolvedValue(undefined);

    await expect(
      useCase.execute(
        'product-id',
        100,
        'Existing Product',
        'Product description',
        'https://example.com/image.jpg',
        10,
      ),
    ).resolves.not.toThrow();

    expect(mockProductService.findByName).toHaveBeenCalledWith(
      'Existing Product',
    );
    expect(mockProductService.update).toHaveBeenCalledWith('product-id', {
      price: 100,
      name: 'Existing Product',
      description: 'Product description',
      photoUrl: 'https://example.com/image.jpg',
      stockQuantity: 10,
    });
  });
});
