import { Injectable } from '@nestjs/common';
import { UserFactory } from 'src/users/domain/factories/user.factory';
import { UserRepository } from 'src/users/domain/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(username: string, email: string, password: string) {
    const user = UserFactory.create(username, email, password);

    await this.userRepository.insert(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(userId: string) {
    return this.userRepository.findById(userId);
  }
}
