import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from '@/products/application/services/product.service';
import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase';
import { Product } from '@/products/domain/entities/product.entity';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductUseCase,
        {
          provide: ProductService,
          useValue: {
            findByName: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateProductUseCase>(UpdateProductUseCase);
    productService = module.get(ProductService);
  });

  it('should update the product when the name does not exist', async () => {
    const productId = 'valid-product-id';
    const updatedFields = {
      price: 200,
      name: 'Updated Product Name',
      description: 'Updated Description',
      photoUrl: 'http://example.com/updated-photo.jpg',
      stockQuantity: 50,
    };

    productService.findByName.mockResolvedValue(null);

    await useCase.execute(
      productId,
      updatedFields.price,
      updatedFields.name,
      updatedFields.description,
      updatedFields.photoUrl,
      updatedFields.stockQuantity,
    );

    expect(productService.findByName).toHaveBeenCalledWith(updatedFields.name);
    expect(productService.update).toHaveBeenCalledWith(
      productId,
      updatedFields,
    );
  });

  it('should throw BadRequestException when the product name already exists', async () => {
    const productId = 'valid-product-id';
    const updatedFields = {
      price: 200,
      name: 'Existing Product Name',
      description: 'Updated Description',
      photoUrl: 'http://example.com/updated-photo.jpg',
      stockQuantity: 50,
    };

    productService.findByName.mockResolvedValue({
      _id: 'existing-product-id',
      name: 'Existing Product Name',
    } as Product);

    await expect(
      useCase.execute(
        productId,
        updatedFields.price,
        updatedFields.name,
        updatedFields.description,
        updatedFields.photoUrl,
        updatedFields.stockQuantity,
      ),
    ).rejects.toThrow(new BadRequestException('Product name already exists'));

    expect(productService.findByName).toHaveBeenCalledWith(updatedFields.name);
    expect(productService.update).not.toHaveBeenCalled();
  });
});
