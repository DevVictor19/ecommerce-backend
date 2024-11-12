import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/infra/users.module';

import { HashProvider } from '../application/providers/hash-provider.contract';
import { JwtProvider } from '../application/providers/jwt-provider.contract';
import { LoginUseCase } from '../application/usecases/login.usecase';
import { SignupUseCase } from '../application/usecases/signup.usecase';
import { AuthController } from './controllers/auth.controller';
import { HashProviderImpl } from './providers/hash.provider';
import { JwtProviderImpl } from './providers/jwt.provider';

@Module({
  imports: [UsersModule],
  providers: [
    { provide: HashProvider, useClass: HashProviderImpl },
    { provide: JwtProvider, useClass: JwtProviderImpl },
    LoginUseCase,
    SignupUseCase,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
