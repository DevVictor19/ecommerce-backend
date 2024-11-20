import { User } from '@/users/domain/entities/user.entity';
import { ROLE } from '@/users/domain/enums/role.enum';

export type JwtPayload = {
  userId: string;
  roles: ROLE[];
};

export abstract class JwtProvider {
  abstract generateToken(user: User): string;
  abstract validateToken(token: string): JwtPayload;
}
