import { Injectable } from '@nestjs/common';

import { Order } from '@/orders/domain/entities/order.entity';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { SortOrder } from '@/shared/domain/repositories/base-paginated-repository.contract';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(order: Order) {
    await this.orderRepository.insert(order);
  }

  findById(orderId: string) {
    return this.orderRepository.findById(orderId);
  }

  findByIdAndUserId(orderId: string, userId: string) {
    return this.orderRepository.findByIdAndUserId(orderId, userId);
  }

  findAllUserOrders(
    page: number,
    size: number,
    sort: SortOrder,
    sortBy: keyof Order,
    userId: string,
    status?: keyof typeof ORDER_STATUS,
  ) {
    return this.orderRepository.findAllPaginated({
      page,
      size,
      sort,
      sortBy,
      userId,
      status,
    });
  }

  findAllOrders(
    page: number,
    size: number,
    sort: SortOrder,
    sortBy: keyof Order,
    status?: keyof typeof ORDER_STATUS,
  ) {
    return this.orderRepository.findAllPaginated({
      page,
      size,
      sort,
      sortBy,
      status,
    });
  }

  async delete(orderId: string) {
    await this.orderRepository.delete(orderId);
  }

  async update(order: Order) {
    await this.orderRepository.update(order._id, {
      cart: order.cart,
      payment: order.payment,
      status: order.status,
    });
  }
}
