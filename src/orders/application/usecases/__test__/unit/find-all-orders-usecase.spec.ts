import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '@/orders/application/services/order.service';
import { FindAllOrdersUseCase } from '@/orders/application/usecases/find-all-orders.usecase';
import { Order } from '@/orders/domain/entities/order.entity';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';
import {
  Page,
  SortOrder,
} from '@/shared/domain/repositories/base-paginated-repository.contract';

describe('FindAllOrdersUseCase', () => {
  let useCase: FindAllOrdersUseCase;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllOrdersUseCase,
        {
          provide: OrderService,
          useValue: {
            findAllOrders: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<FindAllOrdersUseCase>(FindAllOrdersUseCase);
    orderService = module.get(OrderService);
  });

  it('should call OrderService.findAllOrders with correct parameters', async () => {
    const page = 1;
    const size = 10;
    const sort: SortOrder = 'ASC';
    const sortBy: keyof Order = 'createdAt';
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

    orderService.findAllOrders.mockResolvedValue(mockOrders);

    const result = await useCase.execute(page, size, sort, sortBy, status);

    expect(orderService.findAllOrders).toHaveBeenCalledWith(
      page,
      size,
      sort,
      sortBy,
      status,
    );
    expect(result).toEqual(mockOrders);
  });

  it('should return all orders without status when not provided', async () => {
    const page = 1;
    const size = 10;
    const sort: SortOrder = 'DESC';
    const sortBy: keyof Order = 'createdAt';
    const orders: Page<Order> = {
      content: [new Order()],
      page: {
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      },
    };

    orderService.findAllOrders.mockResolvedValue(orders);

    const result = await useCase.execute(page, size, sort, sortBy);

    expect(orderService.findAllOrders).toHaveBeenCalledWith(
      page,
      size,
      sort,
      sortBy,
      undefined,
    );
    expect(result).toEqual(orders);
  });
});
