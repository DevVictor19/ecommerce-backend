import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/application/services/user.service';

import { HashProvider } from '../providers/hash-provider.contract';
import { JwtProvider } from '../providers/jwt-provider.contract';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly hashProvider: HashProvider,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.jwtProvider.generateToken(user);
  }
}
