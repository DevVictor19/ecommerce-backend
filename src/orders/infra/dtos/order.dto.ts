import {
  IsDateString,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { CartDto } from '@/carts/infra/dtos/cart.dto';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';
import { PaymentDto } from '@/payments/infra/dtos/payment.dto';

export class OrderDto {
  @IsString()
  id: string;

  @IsIn([ORDER_STATUS.PAID, ORDER_STATUS.WAITING_PAYMENT])
  status: ORDER_STATUS;

  @IsObject()
  cart: CartDto;

  @IsObject()
  @IsOptional()
  payment: PaymentDto | null;

  @IsDateString()
  createdAt: string;
}
