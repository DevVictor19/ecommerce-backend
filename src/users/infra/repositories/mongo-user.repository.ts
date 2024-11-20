import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseMongoRepository } from '@/shared/infra/repositories/base-mongo.repository';
import { User } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export class MongoUserRepository
  extends BaseMongoRepository<User>
  implements UserRepository
{
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email });
  }
}
