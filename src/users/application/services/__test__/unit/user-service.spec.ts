import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '@/users/application/services/user.service';
import { User } from '@/users/domain/entities/user.entity';
import { UserFactory } from '@/users/domain/factories/user.factory';
import { UserRepository } from '@/users/domain/repositories/user.repository';

jest.mock('@/users/domain/factories/user.factory');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    insert: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create', () => {
    it('should create and insert a new user', async () => {
      const username = 'john_doe';
      const email = 'john.doe@example.com';
      const password = 'password123';
      const user: User = UserFactory.create(username, email, password);

      await userService.create(username, email, password);

      expect(userRepository.insert).toHaveBeenCalledWith(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john.doe@example.com';
      const user: User = UserFactory.create('john_doe', email, 'password123');

      mockUserRepository.findByEmail.mockResolvedValue(user);

      (UserFactory.create as jest.Mock).mockReturnValue(user);
      const result = await userService.findByEmail(email);

      expect(result).toEqual(user);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const userId = 'some-user-id';
      const user: User = UserFactory.create(
        'john_doe',
        'john.doe@example.com',
        'password123',
      );

      mockUserRepository.findById.mockResolvedValue(user);

      (UserFactory.create as jest.Mock).mockReturnValue(user);
      const result = await userService.findById(userId);

      expect(result).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
