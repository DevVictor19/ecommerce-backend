import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '@/orders/application/services/order.service';
import { CancelOrderUseCase } from '@/orders/application/usecases/cancel-order.usecase';
import { Order } from '@/orders/domain/entities/order.entity';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';

describe('CancelOrderUseCase', () => {
  let useCase: CancelOrderUseCase;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelOrderUseCase,
        {
          provide: OrderService,
          useValue: {
            findByIdAndUserId: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CancelOrderUseCase>(CancelOrderUseCase);
    orderService = module.get(OrderService);
  });

  it('should throw NotFoundException if the order is not found', async () => {
    const orderId = 'order-id';
    const userId = 'user-id';
    orderService.findByIdAndUserId.mockResolvedValue(null);

    await expect(useCase.execute(orderId, userId)).rejects.toThrow(
      new NotFoundException('Order not found'),
    );
    expect(orderService.findByIdAndUserId).toHaveBeenCalledWith(
      orderId,
      userId,
    );
  });

  it('should throw BadRequestException if the order status is not WAITING_PAYMENT', async () => {
    const orderId = 'order-id';
    const userId = 'user-id';
    const order = new Order();
    order._id = orderId;
    order.status = ORDER_STATUS.PAID;

    orderService.findByIdAndUserId.mockResolvedValue(order);

    await expect(useCase.execute(orderId, userId)).rejects.toThrow(
      new BadRequestException('Only pending orders can be canceled'),
    );
    expect(orderService.findByIdAndUserId).toHaveBeenCalledWith(
      orderId,
      userId,
    );
  });

  it('should delete the order if it is in WAITING_PAYMENT status', async () => {
    const orderId = 'order-id';
    const userId = 'user-id';
    const order = new Order();
    order._id = orderId;
    order.status = ORDER_STATUS.WAITING_PAYMENT;

    orderService.findByIdAndUserId.mockResolvedValue(order);

    await useCase.execute(orderId, userId);

    expect(orderService.findByIdAndUserId).toHaveBeenCalledWith(
      orderId,
      userId,
    );
    expect(orderService.delete).toHaveBeenCalledWith(orderId);
  });
});
