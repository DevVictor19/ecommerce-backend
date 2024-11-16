import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '@/orders/application/services/order.service';
import { Order } from '@/orders/domain/entities/order.entity';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';
import {
  Card,
  PaymentGateway,
} from '@/payments/application/gateways/payment-gateway.contract';
import { PayOrderWithCreditCardUseCase } from '@/payments/application/usecases/pay-order-with-credit-card.usecase';
import { Payment } from '@/payments/domain/entities/payment.entity';
import { PaymentFactory } from '@/payments/domain/factories/payment.factory';
import { ProductService } from '@/products/application/services/product.service';
import { UserService } from '@/users/application/services/user.service';
import { User } from '@/users/domain/entities/user.entity';

jest.mock('@/orders/application/services/order.service');
jest.mock('@/products/application/services/product.service');
jest.mock('@/users/application/services/user.service');
jest.mock('@/payments/domain/factories/payment.factory');

describe('PayOrderWithCreditCardUseCase', () => {
  let payOrderWithCreditCardUseCase: PayOrderWithCreditCardUseCase;
  let paymentGateway: jest.Mocked<PaymentGateway>;
  let orderService: jest.Mocked<OrderService>;
  let productService: jest.Mocked<ProductService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayOrderWithCreditCardUseCase,
        {
          provide: PaymentGateway,
          useValue: {
            findCustomerByDocument: jest.fn(),
            createCustomer: jest.fn(),
            createCreditCardCharge: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            isAllProductsAvailable: jest.fn(),
            subtractProductsFromStock: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    payOrderWithCreditCardUseCase = module.get<PayOrderWithCreditCardUseCase>(
      PayOrderWithCreditCardUseCase,
    );
    paymentGateway = module.get<PaymentGateway>(
      PaymentGateway,
    ) as jest.Mocked<PaymentGateway>;
    orderService = module.get<OrderService>(
      OrderService,
    ) as jest.Mocked<OrderService>;
    productService = module.get<ProductService>(
      ProductService,
    ) as jest.Mocked<ProductService>;
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
  });

  it('should pay an order with a credit card successfully', async () => {
    const orderId = 'order-id';
    const userId = 'user-id';
    const remoteIp = '127.0.0.1';
    const document = '123456789';
    const parcels = 3;

    const card: Card = {
      holderName: 'holder-name',
      number: '1234',
      expiryYear: '2031',
      expiryMonth: '12',
      ccv: '123',
    };

    const order = { payment: null, cart: { products: [] } } as any;
    const user = {} as User;
    const customer = { id: 'customer-id' };
    const charge = { id: 'charge-id' };
    const payment = { _id: 'payment-id' } as Payment;

    orderService.findById.mockResolvedValue(order);
    userService.findById.mockResolvedValue(user);
    productService.isAllProductsAvailable.mockResolvedValue(true);
    paymentGateway.findCustomerByDocument.mockResolvedValue(customer);
    paymentGateway.createCreditCardCharge.mockResolvedValue(charge);
    (PaymentFactory.createForCreditCard as jest.Mock).mockReturnValue(payment);

    await payOrderWithCreditCardUseCase.execute(
      orderId,
      userId,
      remoteIp,
      document,
      parcels,
      card,
    );

    expect(orderService.update).toHaveBeenCalledWith({
      ...order,
      payment,
      status: ORDER_STATUS.PAID,
    });
    expect(productService.subtractProductsFromStock).toHaveBeenCalledWith(
      order.cart.products,
    );
  });

  it('should throw NotFoundException if order is not found', async () => {
    orderService.findById.mockResolvedValue(null);

    await expect(
      payOrderWithCreditCardUseCase.execute(
        'invalid-order-id',
        'user-id',
        '127.0.0.1',
        '123456789',
        3,
        {} as Card,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if user is not found', async () => {
    orderService.findById.mockResolvedValue({
      _id: 'order-id',
      userId: 'user-id',
    } as Order);
    userService.findById.mockResolvedValue(null);

    await expect(
      payOrderWithCreditCardUseCase.execute(
        'order-id',
        'invalid-user-id',
        '127.0.0.1',
        '123456789',
        3,
        {} as Card,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if user does not own the order', async () => {
    orderService.findById.mockResolvedValue({
      _id: 'order-id',
      userId: 'another-user-id',
    } as Order);
    userService.findById.mockResolvedValue({ _id: 'user-id' } as User);

    await expect(
      payOrderWithCreditCardUseCase.execute(
        'order-id',
        'user-id',
        '127.0.0.1',
        '123456789',
        3,
        {} as Card,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if the order already has a payment', async () => {
    orderService.findById.mockResolvedValue({
      _id: 'order-id',
      payment: { _id: 'payment-id' },
    } as Order);
    userService.findById.mockResolvedValue({ _id: 'user-id' } as User);

    await expect(
      payOrderWithCreditCardUseCase.execute(
        'order-id',
        'user-id',
        '127.0.0.1',
        '123456789',
        3,
        {} as Card,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if not all products are available', async () => {
    const order = {} as Order;
    orderService.findById.mockResolvedValue(order);
    productService.isAllProductsAvailable.mockResolvedValue(false);
    userService.findById.mockResolvedValue({ _id: 'user-id' } as User);

    await expect(
      payOrderWithCreditCardUseCase.execute(
        'order-id',
        'user-id',
        '127.0.0.1',
        '123456789',
        3,
        {} as Card,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
