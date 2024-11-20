import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CartService } from '@/carts/application/services/cart.service';
import { SubtractProductFromCartUseCase } from '@/carts/application/usecases/subtract-product-from-cart.usecase';
import { Cart } from '@/carts/domain/entities/cart.entity';

describe('SubtractProductFromCartUseCase', () => {
  let useCase: SubtractProductFromCartUseCase;
  let cartService: jest.Mocked<CartService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubtractProductFromCartUseCase,
        {
          provide: CartService,
          useValue: {
            findByUserId: jest.fn(),
            subtractCartProduct: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<SubtractProductFromCartUseCase>(
      SubtractProductFromCartUseCase,
    );
    cartService = module.get(CartService);
  });

  it('should throw NotFoundException if the cart does not exist', async () => {
    const productId = 'product-id';
    const userId = 'user-id';
    const quantity = 1;

    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(null);

    await expect(useCase.execute(productId, userId, quantity)).rejects.toThrow(
      NotFoundException,
    );

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(cartService.subtractCartProduct).not.toHaveBeenCalled();
    expect(cartService.delete).not.toHaveBeenCalled();
    expect(cartService.update).not.toHaveBeenCalled();
  });

  it('should subtract a product from the cart and update it', async () => {
    const productId = 'product-id';
    const userId = 'user-id';
    const quantity = 1;

    const mockCart = {
      _id: 'cart-id',
      productsQuantity: 5,
    } as Cart;

    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(mockCart);

    await useCase.execute(productId, userId, quantity);

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(cartService.subtractCartProduct).toHaveBeenCalledWith(
      mockCart,
      productId,
      quantity,
    );
    expect(cartService.delete).not.toHaveBeenCalled();
    expect(cartService.update).toHaveBeenCalledWith(mockCart);
  });

  it('should subtract a product and delete the cart if productsQuantity becomes zero', async () => {
    const productId = 'product-id';
    const userId = 'user-id';
    const quantity = 1;

    const mockCart = {
      _id: 'cart-id',
      productsQuantity: 0,
    } as Cart;

    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(mockCart);

    await useCase.execute(productId, userId, quantity);

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(cartService.subtractCartProduct).toHaveBeenCalledWith(
      mockCart,
      productId,
      quantity,
    );
    expect(cartService.delete).toHaveBeenCalledWith(mockCart._id);
    expect(cartService.update).not.toHaveBeenCalled();
  });
});
