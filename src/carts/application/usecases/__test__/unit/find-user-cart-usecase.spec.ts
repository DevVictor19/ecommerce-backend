import { Test, TestingModule } from '@nestjs/testing';

import { CartService } from '@/carts/application/services/cart.service';
import { FindUserCartUseCase } from '@/carts/application/usecases/find-user-cart.usecase';
import { Cart } from '@/carts/domain/entities/cart.entity';

describe('FindUserCartUseCase', () => {
  let useCase: FindUserCartUseCase;
  let cartService: jest.Mocked<CartService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserCartUseCase,
        {
          provide: CartService,
          useValue: {
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindUserCartUseCase>(FindUserCartUseCase);
    cartService = module.get(CartService);
  });

  it('should return the user cart when it exists', async () => {
    const userId = 'user-id';
    const mockCart = { _id: 'cart-id', userId } as Cart;

    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(mockCart);

    const result = await useCase.execute(userId);

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockCart);
  });

  it('should return null if the user does not have a cart', async () => {
    const userId = 'user-id';

    jest.spyOn(cartService, 'findByUserId').mockResolvedValue(null);

    const result = await useCase.execute(userId);

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });
});
