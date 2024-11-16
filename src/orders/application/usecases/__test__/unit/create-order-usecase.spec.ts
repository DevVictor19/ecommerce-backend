import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CartService } from '@/carts/application/services/cart.service';
import { Cart } from '@/carts/domain/entities/cart.entity';
import { OrderService } from '@/orders/application/services/order.service';
import { CreateOrderUseCase } from '@/orders/application/usecases/create-order.usecase';
import { OrderCart } from '@/orders/domain/entities/oder-cart.entity';
import { Order } from '@/orders/domain/entities/order.entity';
import { OrderFactory } from '@/orders/domain/factories/order.factory';
import { OrderCartFactory } from '@/orders/domain/factories/order-cart.factory';

jest.mock('@/orders/domain/factories/order-cart.factory');
jest.mock('@/orders/domain/factories/order.factory');

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderService: jest.Mocked<OrderService>;
  let cartService: jest.Mocked<CartService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CartService,
          useValue: {
            findByUserId: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderService = module.get(OrderService);
    cartService = module.get(CartService);
  });

  it('should throw NotFoundException if the cart is not found', async () => {
    const userId = 'user-id';
    cartService.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrow(
      new NotFoundException('Cart not found'),
    );

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('should create an order and delete the cart', async () => {
    const userId = 'user-id';
    const cart = new Cart();
    cart._id = 'cart-id';
    cart.products = [];
    cart.productsQuantity = 0;
    cart.totalPrice = 0;
    cart.createdAt = new Date();

    const orderCart = new OrderCart();
    const order = new Order();

    cartService.findByUserId.mockResolvedValue(cart);
    (OrderCartFactory.create as jest.Mock).mockReturnValue(orderCart);
    (OrderFactory.create as jest.Mock).mockReturnValue(order);

    await useCase.execute(userId);

    expect(cartService.findByUserId).toHaveBeenCalledWith(userId);
    expect(OrderCartFactory.create).toHaveBeenCalledWith(
      cart._id,
      cart.products,
      cart.productsQuantity,
      cart.totalPrice,
      cart.createdAt,
    );
    expect(OrderFactory.create).toHaveBeenCalledWith(userId, orderCart);
    expect(orderService.create).toHaveBeenCalledWith(order);
    expect(cartService.delete).toHaveBeenCalledWith(cart._id);
  });
});
