import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CartProduct } from '@/carts/domain/entities/cart-product.entity';
import { ProductService } from '@/products/application/services/product.service';
import { Product } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            findAllPaginated: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            findByName: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(ProductRepository);
  });

  it('should call the repository to fetch paginated products', () => {
    const page = 1;
    const size = 10;
    const sort = 'ASC';
    const sortBy = 'name' as keyof Product;
    const name = 'Product Name';

    service.findAllPaginated(page, size, sort, sortBy, name);

    expect(repository.findAllPaginated).toHaveBeenCalledWith({
      page,
      size,
      sort,
      sortBy,
      name,
    });
  });

  it('should insert a product', async () => {
    const product: Product = {
      _id: '1',
      name: 'Test',
      price: 100,
      description: 'Desc',
      photoUrl: 'url',
      stockQuantity: 10,
      createdAt: new Date(),
    };

    await service.create(product);

    expect(repository.insert).toHaveBeenCalledWith(product);
  });

  it('should update a product', async () => {
    const productId = '1';
    const fields = { price: 200 };

    await service.update(productId, fields);

    expect(repository.update).toHaveBeenCalledWith(productId, fields);
  });

  it('should find a product by name', () => {
    const name = 'Product Name';

    service.findByName(name);

    expect(repository.findByName).toHaveBeenCalledWith(name);
  });

  it('should find a product by id', () => {
    const id = '1';

    service.findById(id);

    expect(repository.findById).toHaveBeenCalledWith(id);
  });

  it('should delete a product by id', async () => {
    const id = '1';

    await service.delete(id);

    expect(repository.delete).toHaveBeenCalledWith(id);
  });

  it('should verify if all products in the cart are available', async () => {
    const cartProducts = [
      { _id: '1', inCartQuantity: 2 },
      { _id: '2', inCartQuantity: 1 },
    ] as CartProduct[];

    const stockProduct1: Product = {
      _id: '1',
      stockQuantity: 5,
      name: '',
      description: '',
      photoUrl: '',
      price: 100,
      createdAt: new Date(),
    };
    const stockProduct2: Product = {
      _id: '2',
      stockQuantity: 2,
      name: '',
      description: '',
      photoUrl: '',
      price: 100,
      createdAt: new Date(),
    };

    repository.findById
      .mockResolvedValueOnce(stockProduct1)
      .mockResolvedValueOnce(stockProduct2);

    const result = await service.isAllProductsAvailable(cartProducts);

    expect(result).toBe(true);
  });

  it('should return false if any product in the cart is unavailable', async () => {
    const cartProducts = [
      { _id: '1', inCartQuantity: 2 },
      { _id: '2', inCartQuantity: 3 },
    ] as CartProduct[];

    const stockProduct1: Product = {
      _id: '1',
      stockQuantity: 5,
      name: '',
      description: '',
      photoUrl: '',
      price: 100,
      createdAt: new Date(),
    };
    const stockProduct2: Product = {
      _id: '2',
      stockQuantity: 2,
      name: '',
      description: '',
      photoUrl: '',
      price: 100,
      createdAt: new Date(),
    };

    repository.findById
      .mockResolvedValueOnce(stockProduct1)
      .mockResolvedValueOnce(stockProduct2);

    const result = await service.isAllProductsAvailable(cartProducts);

    expect(result).toBe(false);
  });

  it('should throw NotFoundException if subtracting from stock of a non-existing product', async () => {
    const cartProduct = { _id: '1', inCartQuantity: 2 } as CartProduct;
    repository.findById.mockResolvedValueOnce(null);

    await expect(
      service.subtractProductsFromStock([cartProduct]),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if stock is insufficient', async () => {
    const cartProduct = { _id: '1', inCartQuantity: 10 } as CartProduct;
    const stockProduct: Product = {
      _id: '1',
      stockQuantity: 5,
      name: '',
      description: '',
      photoUrl: '',
      price: 100,
      createdAt: new Date(),
    };
    repository.findById.mockResolvedValueOnce(stockProduct);

    await expect(
      service.subtractProductsFromStock([cartProduct]),
    ).rejects.toThrow(BadRequestException);
  });

  it('should update stock quantity when subtracting products from stock', async () => {
    const cartProduct = { _id: '1', inCartQuantity: 2 } as CartProduct;
    const stockProduct: Product = {
      _id: '1',
      stockQuantity: 5,
      name: '',
      description: '',
      photoUrl: '',
      price: 100,
      createdAt: new Date(),
    };
    repository.findById.mockResolvedValueOnce(stockProduct);

    await service.subtractProductsFromStock([cartProduct]);

    expect(repository.update).toHaveBeenCalledWith('1', { stockQuantity: 3 });
  });
});
