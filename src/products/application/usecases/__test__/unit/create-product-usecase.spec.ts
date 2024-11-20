import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from '@/products/application/services/product.service';
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { Product } from '@/products/domain/entities/product.entity';
import { ProductFactory } from '@/products/domain/factories/product.factory';

jest.mock('@/products/domain/factories/product.factory');

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        {
          provide: ProductService,
          useValue: {
            findByName: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    productService = module.get(ProductService);
  });

  it('should throw BadRequestException if product name already exists', async () => {
    const price = 100;
    const name = 'Existing Product';
    const description = 'Description';
    const photoUrl = 'http://photo.url';
    const stockQuantity = 10;

    productService.findByName.mockResolvedValue({} as Product);

    await expect(
      useCase.execute(price, name, description, photoUrl, stockQuantity),
    ).rejects.toThrow(BadRequestException);

    expect(productService.findByName).toHaveBeenCalledWith(name);
  });

  it('should create a new product when name is unique', async () => {
    const price = 100;
    const name = 'New Product';
    const description = 'Description';
    const photoUrl = 'http://photo.url';
    const stockQuantity = 10;

    const mockProduct = {} as Product;
    (ProductFactory.create as jest.Mock).mockReturnValue(mockProduct);

    productService.findByName.mockResolvedValue(null);

    await useCase.execute(price, name, description, photoUrl, stockQuantity);

    expect(productService.findByName).toHaveBeenCalledWith(name);
    expect(ProductFactory.create).toHaveBeenCalledWith(
      price,
      name,
      description,
      photoUrl,
      stockQuantity,
    );
    expect(productService.create).toHaveBeenCalledWith(mockProduct);
  });
});
