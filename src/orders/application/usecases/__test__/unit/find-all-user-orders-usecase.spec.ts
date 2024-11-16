import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '@/orders/application/services/order.service';
import { FindAllUserOrdersUseCase } from '@/orders/application/usecases/find-all-user-orders.usecase';
import { Order } from '@/orders/domain/entities/order.entity';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';
import {
  Page,
  SortOrder,
} from '@/shared/domain/repositories/base-paginated-repository.contract';

describe('FindAllUserOrdersUseCase', () => {
  let useCase: FindAllUserOrdersUseCase;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUserOrdersUseCase,
        {
          provide: OrderService,
          useValue: {
            findAllUserOrders: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllUserOrdersUseCase>(FindAllUserOrdersUseCase);
    orderService = module.get(OrderService);
  });

  it('should call OrderService.findAllUserOrders with correct parameters', async () => {
    const page = 1;
    const size = 10;
    const sort: SortOrder = 'ASC';
    const sortBy: keyof Order = 'createdAt';
    const userId = 'user-1';
    const status: keyof typeof ORDER_STATUS = 'WAITING_PAYMENT';

    const mockOrders: Page<Order> = {
      content: [new Order()],
      page: {
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      },
    };

    orderService.findAllUserOrders.mockResolvedValue(mockOrders);

    const result = await useCase.execute(
      page,
      size,
      sort,
      sortBy,
      userId,
      status,
    );

    expect(orderService.findAllUserOrders).toHaveBeenCalledWith(
      page,
      size,
      sort,
      sortBy,
      userId,
      status,
    );
    expect(result).toEqual(mockOrders);
  });

  it('should return all user orders without status when not provided', async () => {
    const page = 1;
    const size = 10;
    const sort: SortOrder = 'DESC';
    const sortBy: keyof Order = 'createdAt';
    const userId = 'user-2';

    const mockOrders: Page<Order> = {
      content: [new Order()],
      page: {
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      },
    };

    orderService.findAllUserOrders.mockResolvedValue(mockOrders);

    const result = await useCase.execute(page, size, sort, sortBy, userId);

    expect(orderService.findAllUserOrders).toHaveBeenCalledWith(
      page,
      size,
      sort,
      sortBy,
      userId,
      undefined,
    );
    expect(result).toEqual(mockOrders);
  });
});
