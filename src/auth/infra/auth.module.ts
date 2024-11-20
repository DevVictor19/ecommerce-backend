import { Global, Module } from '@nestjs/common';

import { UsersModule } from '@/users/infra/users.module';

import { HashProvider } from '../application/providers/hash-provider.contract';
import { JwtProvider } from '../application/providers/jwt-provider.contract';
import { LoginUseCase } from '../application/usecases/login.usecase';
import { SignupUseCase } from '../application/usecases/signup.usecase';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { HashProviderImpl } from './providers/hash.provider';
import { JwtProviderImpl } from './providers/jwt.provider';

@Global()
@Module({
  imports: [UsersModule],
  providers: [
    { provide: HashProvider, useClass: HashProviderImpl },
    { provide: JwtProvider, useClass: JwtProviderImpl },
    LoginUseCase,
    SignupUseCase,
    AuthGuard,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [JwtProvider, AuthGuard, RolesGuard],
})
export class AuthModule {}
