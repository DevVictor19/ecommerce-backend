import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrderService } from '@/orders/application/services/order.service';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';
import { PaymentFactory } from '@/payments/domain/factories/payment.factory';
import { ProductService } from '@/products/application/services/product.service';
import { UserService } from '@/users/application/services/user.service';

import { Card, PaymentGateway } from '../gateways/payment-gateway.contract';

@Injectable()
export class PayOrderWithCreditCardUseCase {
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  async execute(
    orderId: string,
    userId: string,
    remoteIp: string,
    document: string,
    parcels: number,
    card: Card,
  ) {
    const [order, user] = await Promise.all([
      this.orderService.findById(orderId),
      this.userService.findById(userId),
    ]);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (order.userId !== user._id) {
      throw new BadRequestException("User don't owns this order to pay it");
    }

    if (order.payment !== null) {
      throw new BadRequestException('This order already have a payment');
    }

    const isAllProductsAvailable =
      await this.productService.isAllProductsAvailable(order.cart.products);

    if (!isAllProductsAvailable) {
      throw new BadRequestException('Not all products are available');
    }

    let customer = await this.paymentGateway.findCustomerByDocument(document);

    if (!customer) {
      customer = await this.paymentGateway.createCustomer(
        user.username,
        user.email,
        document,
      );
    }

    const charge = await this.paymentGateway.createCreditCardCharge(
      customer.id,
      remoteIp,
      order.cart.totalPrice,
      parcels,
      card,
    );

    const payment = PaymentFactory.createForCreditCard(
      charge.id,
      order.cart.totalPrice,
      parcels,
    );

    order.payment = payment;
    order.status = ORDER_STATUS.PAID;

    await Promise.all([
      this.orderService.update(order),
      this.productService.subtractProductsFromStock(order.cart.products),
    ]);
  }
}
