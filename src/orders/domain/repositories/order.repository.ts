import { BasePaginatedRepository } from '@/shared/domain/repositories/base-paginated-repository.contract';

import { Order } from '../entities/order.entity';

export abstract class OrderRepository extends BasePaginatedRepository<Order> {
  abstract findByIdAndUserId(
    orderId: string,
    userId: string,
  ): Promise<Order | null>;
}
