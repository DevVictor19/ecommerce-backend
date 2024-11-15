import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart } from '@/carts/domain/entities/cart.entity';
import { CartRepository } from '@/carts/domain/repositories/cart.repository';
import { BaseMongoRepository } from '@/shared/infra/repositories/base-mongo.repository';

export class MongoCartRepository
  extends BaseMongoRepository<Cart>
  implements CartRepository
{
  constructor(@InjectModel(Cart.name) cartModel: Model<Cart>) {
    super(cartModel);
  }

  findByUserId(userId: string): Promise<Cart | null> {
    return this.model.findOne({ userId });
  }
}
