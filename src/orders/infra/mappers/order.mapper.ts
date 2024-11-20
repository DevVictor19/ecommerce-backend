import { Order } from '@/orders/domain/entities/order.entity';
import { PaymentMapper } from '@/payments/infra/mappers/payment.mapper';

import { OrderDto } from '../dtos/order.dto';
import { OrderCartMapper } from './order-cart.mapper';

export class OrderMapper {
  static toDto(entity: Order): OrderDto {
    const dto = new OrderDto();

    dto.id = entity._id;
    dto.status = entity.status;
    dto.cart = OrderCartMapper.toDto(entity.cart);
    dto.payment = entity.payment && PaymentMapper.toDto(entity.payment);
    dto.createdAt = entity.createdAt.toISOString();

    return dto;
  }
}
