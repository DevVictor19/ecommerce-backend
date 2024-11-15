import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from '@/products/application/services/product.service';
import { FindAllProductsUseCase } from '@/products/application/usecases/find-all-products.usecase';
import { Product } from '@/products/domain/entities/product.entity';
import {
  Page,
  SortOrder,
} from '@/shared/domain/repositories/base-paginated-repository.contract';

describe('FindAllProductsUseCase', () => {
  let useCase: FindAllProductsUseCase;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllProductsUseCase,
        {
          provide: ProductService,
          useValue: {
            findAllPaginated: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllProductsUseCase>(FindAllProductsUseCase);
    productService = module.get(ProductService);
  });

  it('should return paginated products', async () => {
    const page = 1;
    const size = 10;
    const sort: SortOrder = 'ASC';
    const sortBy: keyof Product = 'name';
    const name = 'test-product';

    const mockResult: Page<Product> = {
      content: [],
      page: {
        number: page,
        size: size,
        totalElements: 0,
        totalPages: 0,
      },
    };

    productService.findAllPaginated.mockResolvedValue(mockResult);

    const result = await useCase.execute(page, size, sort, sortBy, name);

    expect(productService.findAllPaginated).toHaveBeenCalledWith(
      page,
      size,
      sort,
      sortBy,
      name,
    );
    expect(result).toEqual(mockResult);
  });

  it('should return paginated products without a name filter', async () => {
    const page = 1;
    const size = 10;
    const sort: SortOrder = 'DESC';
    const sortBy: keyof Product = 'price';

    const mockResult: Page<Product> = {
      content: [{ name: 'test' } as Product],
      page: {
        number: page,
        size: size,
        totalElements: 1,
        totalPages: 1,
      },
    };

    productService.findAllPaginated.mockResolvedValue(mockResult);

    const result = await useCase.execute(page, size, sort, sortBy);

    expect(productService.findAllPaginated).toHaveBeenCalledWith(
      page,
      size,
      sort,
      sortBy,
      undefined,
    );
    expect(result).toEqual(mockResult);
  });
});
