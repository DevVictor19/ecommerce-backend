import { Injectable } from '@nestjs/common';
import { Order } from 'src/orders/domain/entities/order.entity';
import { ORDER_STATUS } from 'src/orders/domain/enum/order-status.enum';
import { SortOrder } from 'src/shared/domain/repositories/base-paginated-repository.contract';

import { OrderService } from '../services/order.service';

@Injectable()
export class FindAllOrdersUseCase {
  constructor(private readonly orderService: OrderService) {}

  execute(
    page: number,
    size: number,
    sort: SortOrder,
    sortBy: keyof Order,
    status?: keyof typeof ORDER_STATUS,
  ) {
    return this.orderService.findAllOrders(page, size, sort, sortBy, status);
  }
}
