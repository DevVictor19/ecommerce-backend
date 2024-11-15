import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CartService } from '@/carts/application/services/cart.service';
import { AddProductToCartUseCase } from '@/carts/application/usecases/add-product-to-cart.usecase';
import { Cart } from '@/carts/domain/entities/cart.entity';
import { CartFactory } from '@/carts/domain/factories/cart.factory';
import { CartProductFactory } from '@/carts/domain/factories/cart-product.factory';
import { ProductService } from '@/products/application/services/product.service';
import { Product } from '@/products/domain/entities/product.entity';

jest.mock('@/carts/domain/factories/cart.factory');
jest.mock('@/carts/domain/factories/cart-product.factory');

describe('AddProductToCartUseCase', () => {
  let useCase: AddProductToCartUseCase;
  let cartService: jest.Mocked<CartService>;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddProductToCartUseCase,
        {
          provide: CartService,
          useValue: {
            findByUserId: jest.fn(),
            addCartProduct: jest.fn(),
            checkCartProductStockAvailability: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<AddProductToCartUseCase>(AddProductToCartUseCase);
    cartService = module.get(CartService);
    productService = module.get(ProductService);
  });

  it('should add a product to an existing cart', async () => {
    const userId = faker.database.mongodbObjectId();
    const productId = faker.database.mongodbObjectId();
    const quantity = faker.number.int({ min: 1, max: 5 });

    const product: Product = {
      _id: productId,
      price: faker.number.int({ min: 100, max: 10000 }),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      photoUrl: faker.internet.url(),
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      createdAt: faker.date.past(),
    };

    const userCart = new Cart();

    jest.spyOn(productService, 'findById').mockResolvedValue(product);
    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(userCart);

    const cartProduct = { ...product, inCartQuantity: quantity };
    (CartProductFactory.create as jest.Mock).mockReturnValue(cartProduct);

    await useCase.execute(productId, userId, quantity);

    expect(productService.findById).toHaveBeenCalledWith(productId);
    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(cartService.addCartProduct).toHaveBeenCalledWith(
      userCart,
      cartProduct,
    );
    expect(cartService.checkCartProductStockAvailability).toHaveBeenCalledWith(
      userCart,
      product,
    );
    expect(cartService.update).toHaveBeenCalledWith(userCart);
  });

  it('should create a new cart if the user does not have one', async () => {
    const userId = faker.database.mongodbObjectId();
    const productId = faker.database.mongodbObjectId();
    const quantity = faker.number.int({ min: 1, max: 5 });

    const product: Product = {
      _id: productId,
      price: faker.number.int({ min: 100, max: 10000 }),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      photoUrl: faker.internet.url(),
      stockQuantity: faker.number.int({ min: 10, max: 100 }),
      createdAt: faker.date.past(),
    };

    jest.spyOn(productService, 'findById').mockResolvedValue(product);
    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(null);

    const newCart = new Cart();
    const cartProduct = { ...product, inCartQuantity: quantity };

    (CartFactory.create as jest.Mock).mockReturnValue(newCart);
    (CartProductFactory.create as jest.Mock).mockReturnValue(cartProduct);

    await useCase.execute(productId, userId, quantity);

    expect(productService.findById).toHaveBeenCalledWith(productId);
    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(CartFactory.create).toHaveBeenCalledWith(userId);
    expect(cartService.addCartProduct).toHaveBeenCalledWith(
      newCart,
      cartProduct,
    );
    expect(cartService.checkCartProductStockAvailability).toHaveBeenCalledWith(
      newCart,
      product,
    );
    expect(cartService.create).toHaveBeenCalledWith(newCart);
  });

  it('should throw NotFoundException if the product does not exist', async () => {
    const userId = faker.database.mongodbObjectId();
    const productId = faker.database.mongodbObjectId();
    const quantity = faker.number.int({ min: 1, max: 5 });

    jest.spyOn(productService, 'findById').mockResolvedValue(null);

    await expect(useCase.execute(productId, userId, quantity)).rejects.toThrow(
      NotFoundException,
    );

    expect(productService.findById).toHaveBeenCalledWith(productId);
    expect(cartService.findByUserId).not.toHaveBeenCalled();
    expect(cartService.addCartProduct).not.toHaveBeenCalled();
    expect(cartService.create).not.toHaveBeenCalled();
  });
});
