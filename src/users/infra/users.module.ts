import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from '../application/services/user.service';
import { User, UserSchema } from '../domain/entities/user.entity';
import { UserRepository } from '../domain/repositories/user.repository';
import { MongoUserRepository } from './repositories/mongo-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    { provide: UserRepository, useClass: MongoUserRepository },
    UserService,
  ],
  exports: [UserService],
})
export class UsersModule {}
