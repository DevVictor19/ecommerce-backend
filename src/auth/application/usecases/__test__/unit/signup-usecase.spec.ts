import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HashProvider } from '@/auth/application/providers/hash-provider.contract';
import { SignupUseCase } from '@/auth/application/usecases/signup.usecase';
import { UserService } from '@/users/application/services/user.service';

describe('SignupUseCase', () => {
  let signupUseCase: SignupUseCase;

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockHashProvider = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupUseCase,
        { provide: UserService, useValue: mockUserService },
        { provide: HashProvider, useValue: mockHashProvider },
      ],
    }).compile();

    signupUseCase = module.get<SignupUseCase>(SignupUseCase);
  });

  describe('execute', () => {
    it('should throw BadRequestException if email is already in use', async () => {
      const username = 'john_doe';
      const email = 'john.doe@example.com';
      const password = 'password123';

      mockUserService.findByEmail.mockResolvedValue({ email });

      await expect(
        signupUseCase.execute(username, email, password),
      ).rejects.toThrow(BadRequestException);
      await expect(
        signupUseCase.execute(username, email, password),
      ).rejects.toThrow('Email already in use');
    });

    it('should create a new user if email is not already in use', async () => {
      const username = 'john_doe';
      const email = 'john.doe@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      mockUserService.findByEmail.mockResolvedValue(null);
      mockHashProvider.hash.mockResolvedValue(hashedPassword);

      await signupUseCase.execute(username, email, password);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockHashProvider.hash).toHaveBeenCalledWith(password);
      expect(mockUserService.create).toHaveBeenCalledWith(
        username,
        email,
        hashedPassword,
      );
    });
  });
});
