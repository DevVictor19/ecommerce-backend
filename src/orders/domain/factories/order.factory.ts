import { randomUUID } from 'node:crypto';

import { OrderCart } from '../entities/oder-cart.entity';
import { Order } from '../entities/order.entity';
import { ORDER_STATUS } from '../enum/order-status.enum';

export class OrderFactory {
  static create(userId: string, cart: OrderCart): Order {
    const entity = new Order();

    entity._id = randomUUID();
    entity.cart = cart;
    entity.createdAt = new Date();
    entity.payment = null;
    entity.status = ORDER_STATUS.WAITING_PAYMENT;
    entity.userId = userId;

    return entity;
  }
}
