import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Payment } from '@/payments/domain/entities/payment.entity';

import { ORDER_STATUS } from '../enum/order-status.enum';
import { OrderCart } from './oder-cart.entity';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ collection: 'orders' })
export class Order {
  @Prop()
  _id: string;

  @Prop()
  userId: string;

  @Prop({ type: String })
  status: ORDER_STATUS;

  @Prop({ type: OrderCart })
  cart: OrderCart;

  @Prop({ type: Payment })
  payment: Payment | null;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
