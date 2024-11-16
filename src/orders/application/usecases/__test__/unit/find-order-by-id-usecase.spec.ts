import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '@/orders/application/services/order.service';
import { FindOrderByIdUseCase } from '@/orders/application/usecases/find-order-by-id.usecase';
import { Order } from '@/orders/domain/entities/order.entity';

describe('FindOrderByIdUseCase', () => {
  let useCase: FindOrderByIdUseCase;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrderByIdUseCase,
        {
          provide: OrderService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindOrderByIdUseCase>(FindOrderByIdUseCase);
    orderService = module.get(OrderService);
  });

  it('should return the order when it exists', async () => {
    const orderId = 'order-1';
    const mockOrder = new Order();

    orderService.findById.mockResolvedValue(mockOrder);

    const result = await useCase.execute(orderId);

    expect(orderService.findById).toHaveBeenCalledWith(orderId);
    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundException when the order does not exist', async () => {
    const orderId = 'non-existent-order';

    orderService.findById.mockResolvedValue(null);

    await expect(useCase.execute(orderId)).rejects.toThrow(NotFoundException);
    expect(orderService.findById).toHaveBeenCalledWith(orderId);
  });
});
