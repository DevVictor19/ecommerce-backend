import { BadRequestException, Injectable } from '@nestjs/common';

import { UserService } from '@/users/application/services/user.service';

import { HashProvider } from '../providers/hash-provider.contract';

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(username: string, email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPass = await this.hashProvider.hash(password);

    await this.userService.create(username, email, hashedPass);
  }
}
