import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CartService } from '@/carts/application/services/cart.service';
import { ClearCartUseCase } from '@/carts/application/usecases/clear-cart.usecase';
import { Cart } from '@/carts/domain/entities/cart.entity';

describe('ClearCartUseCase', () => {
  let useCase: ClearCartUseCase;
  let cartService: jest.Mocked<CartService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClearCartUseCase,
        {
          provide: CartService,
          useValue: {
            findByUserId: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ClearCartUseCase>(ClearCartUseCase);
    cartService = module.get(CartService);
  });

  it('should delete the cart if it exists', async () => {
    const userId = 'user-id';
    const cart = { _id: 'cart-id', userId };

    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(cart as Cart);
    jest.spyOn(cartService, 'delete').mockResolvedValue(undefined);

    await useCase.execute(userId);

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(cartService.delete).toHaveBeenCalledWith(cart._id);
  });

  it('should throw NotFoundException if the cart does not exist', async () => {
    const userId = 'user-id';

    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrow(NotFoundException);

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(cartService.delete).not.toHaveBeenCalled();
  });
});
