import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import {
  JwtPayload,
  JwtProvider,
} from 'src/auth/application/providers/jwt-provider.contract';
import { EnvConfigProvider } from 'src/shared/application/providers/env-config-provider.contract';
import { User } from 'src/users/domain/entities/user.entity';

@Injectable()
export class JwtProviderImpl implements JwtProvider {
  private secretKey: string;

  constructor(private readonly envConfigProvider: EnvConfigProvider) {
    this.secretKey = envConfigProvider.getServerSecret();
  }

  generateToken(user: User): string {
    const payload: JwtPayload = {
      roles: user.roles,
      userId: user._id,
    };

    return sign(payload, this.secretKey, {
      expiresIn: '4h',
      issuer: this.envConfigProvider.getServerUrl(),
    });
  }

  validateToken(token: string): JwtPayload {
    const result = verify(token, this.secretKey);

    if (typeof result === 'string') {
      throw new Error('Invalid jwt payload');
    }

    return {
      roles: result.roles,
      userId: result.userId,
    };
  }
}
