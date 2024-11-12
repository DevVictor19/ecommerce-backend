import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMongoRepository } from 'src/shared/infra/repositories/base-mongo.repository';
import { User } from 'src/users/domain/entities/user.entity';
import { UserRepository } from 'src/users/domain/repositories/user.repository';

@Injectable()
export class MongoUserRepository
  extends BaseMongoRepository<User>
  implements UserRepository
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
}