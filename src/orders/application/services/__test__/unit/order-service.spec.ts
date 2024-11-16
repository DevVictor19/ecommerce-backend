import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '@/orders/application/services/order.service';
import { Order } from '@/orders/domain/entities/order.entity';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { PAYMENT_METHOD } from '@/payments/domain/enums/payment-method.enum';
import {
  Page,
  SortOrder,
} from '@/shared/domain/repositories/base-paginated-repository.contract';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            insert: jest.fn(),
            findById: jest.fn(),
            findByIdAndUserId: jest.fn(),
            findAllPaginated: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(OrderRepository);
  });

  it('should create an order', async () => {
    const order = new Order();
    await service.create(order);
    expect(orderRepository.insert).toHaveBeenCalledWith(order);
  });

  it('should find an order by id', async () => {
    const orderId = 'order-id';
    const order = new Order();
    orderRepository.findById.mockResolvedValue(order);
    const result = await service.findById(orderId);
    expect(result).toBe(order);
    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
  });

  it('should find an order by id and user id', async () => {
    const orderId = 'order-id';
    const userId = 'user-id';
    const order = new Order();
    orderRepository.findByIdAndUserId.mockResolvedValue(order);
    const result = await service.findByIdAndUserId(orderId, userId);
    expect(result).toBe(order);
    expect(orderRepository.findByIdAndUserId).toHaveBeenCalledWith(
      orderId,
      userId,
    );
  });

  it('should find all user orders with pagination', async () => {
    const page = 1;
    const size = 10;
    const sort: SortOrder = 'ASC';
    const sortBy: keyof Order = '_id';
    const userId = 'user-id';
    const orders: Page<Order> = {
      content: [new Order()],
      page: {
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
      },
    };
    orderRepository.findAllPaginated.mockResolvedValue(orders);
    const result = await service.findAllUserOrders(
      page,
      size,
      sort,
      sortBy,
      userId,
    );
    expect(result).toBe(orders);
    expect(orderRepository.findAllPaginated).toHaveBeenCalledWith({
      page,
      size,
      sort,
      sortBy,
      userId,
      status: undefined,
    });
  });

  it('should find all orders with pagination', async () => {
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
    orderRepository.findAllPaginated.mockResolvedValue(orders);
    const result = await service.findAllOrders(page, size, sort, sortBy);
    expect(result).toBe(orders);
    expect(orderRepository.findAllPaginated).toHaveBeenCalledWith({
      page,
      size,
      sort,
      sortBy,
      status: undefined,
    });
  });

  it('should delete an order', async () => {
    const orderId = 'order-id';
    await service.delete(orderId);
    expect(orderRepository.delete).toHaveBeenCalledWith(orderId);
  });

  it('should update an order', async () => {
    const order = new Order();
    order._id = 'order-id';
    order.cart = {
      _id: 'id',
      products: [
        {
          _id: 'id',
          description: 'description',
          inCartQuantity: 1,
          name: 'name',
          photoUrl: 'photo-url',
          price: 1000,
        },
      ],
      productsQuantity: 1,
      totalPrice: 2000,
      createdAt: new Date(),
    };
    order.payment = {
      _id: 'id',
      createdAt: new Date(),
      method: PAYMENT_METHOD.CREDIT_CARD,
      parcels: 2,
      price: 2000,
      transactionCode: 'code',
    };
    order.status = ORDER_STATUS.PAID;

    await service.update(order);
    expect(orderRepository.update).toHaveBeenCalledWith(order._id, {
      cart: order.cart,
      payment: order.payment,
      status: order.status,
    });
  });
});
