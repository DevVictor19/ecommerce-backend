import { User } from '@/users/domain/entities/user.entity';
import { ROLE } from '@/users/domain/enums/role.enum';
import { UserFactory } from '@/users/domain/factories/user.factory';

describe('UserFactory', () => {
  it('should create a User entity with the given parameters', () => {
    const username = 'john_doe';
    const email = 'john.doe@example.com';
    const password = 'password123';

    const user: User = UserFactory.create(username, email, password);

    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
    expect(user.roles).toEqual([ROLE.CLIENT]);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user._id).toBeDefined();
  });
});
