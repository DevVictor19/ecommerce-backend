import { BaseRepository } from 'src/shared/domain/repositories/base-repository.contract';

import { Cart } from '../entities/cart.entity';

export abstract class CartRepository extends BaseRepository<Cart> {
  abstract findByUserId(userId: string): Promise<Cart | null>;
}
