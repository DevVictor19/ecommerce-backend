import { randomUUID } from 'node:crypto';

import { User } from '../entities/user.entity';
import { ROLE } from '../enums/role.enum';

export class UserFactory {
  static create(username: string, email: string, password: string): User {
    const entity = new User();
    entity.createdAt = new Date();
    entity.email = email;
    entity._id = randomUUID();
    entity.password = password;
    entity.roles = [ROLE.CLIENT];
    entity.username = username;
    return entity;
  }
}
