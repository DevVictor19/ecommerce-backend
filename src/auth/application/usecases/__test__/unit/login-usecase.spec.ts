import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HashProvider } from '@/auth/application/providers/hash-provider.contract';
import { JwtProvider } from '@/auth/application/providers/jwt-provider.contract';
import { LoginUseCase } from '@/auth/application/usecases/login.usecase';
import { UserService } from '@/users/application/services/user.service';
import { User } from '@/users/domain/entities/user.entity';
import { ROLE } from '@/users/domain/enums/role.enum';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockHashProvider = {
    compare: jest.fn(),
  };

  const mockJwtProvider = {
    generateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: UserService, useValue: mockUserService },
        { provide: HashProvider, useValue: mockHashProvider },
        { provide: JwtProvider, useValue: mockJwtProvider },
      ],
    }).compile();

    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  describe('execute', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(loginUseCase.execute(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(loginUseCase.execute(email, password)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';
      const user: User = {
        _id: 'some-id',
        email,
        password: 'hashed-password',
        createdAt: new Date(),
        roles: [ROLE.CLIENT],
        username: 'john_doe',
      };

      mockUserService.findByEmail.mockResolvedValue(user);
      mockHashProvider.compare.mockResolvedValue(false);

      await expect(loginUseCase.execute(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(loginUseCase.execute(email, password)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should return a token if login is successful', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';
      const user: User = {
        _id: 'some-id',
        email,
        password: 'hashed-password',
        createdAt: new Date(),
        roles: [ROLE.CLIENT],
        username: 'john_doe',
      };
      const token = 'generated-jwt-token';

      mockUserService.findByEmail.mockResolvedValue(user);
      mockHashProvider.compare.mockResolvedValue(true);
      mockJwtProvider.generateToken.mockResolvedValue(token);

      const result = await loginUseCase.execute(email, password);

      expect(result).toBe(token);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockHashProvider.compare).toHaveBeenCalledWith(
        password,
        user.password,
      );
      expect(mockJwtProvider.generateToken).toHaveBeenCalledWith(user);
    });
  });
});
