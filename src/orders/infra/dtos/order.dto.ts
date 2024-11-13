import {
  IsDateString,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CartDto } from 'src/carts/infra/dtos/cart.dto';
import { ORDER_STATUS } from 'src/orders/domain/enum/order-status.enum';
import { PaymentDto } from 'src/payments/infra/dtos/payment.dto';

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
