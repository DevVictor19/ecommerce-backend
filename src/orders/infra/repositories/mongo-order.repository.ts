import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/orders/domain/entities/order.entity';
import { OrderRepository } from 'src/orders/domain/repositories/order.repository';
import { BasePaginatedMongoRepository } from 'src/shared/infra/repositories/base-paginated-mongo.repository';

export class MongoOrderRepository
  extends BasePaginatedMongoRepository<Order>
  implements OrderRepository
{
  constructor(@InjectModel(Order.name) orderModel: Model<Order>) {
    super(orderModel);
  }

  findByIdAndUserId(orderId: string, userId: string): Promise<Order | null> {
    return this.model.findOne({ _id: orderId, userId });
  }
}
