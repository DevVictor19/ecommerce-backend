import { BasePaginatedRepository } from 'src/shared/domain/repositories/base-paginated-repository.contract';

import { Product } from '../entities/product.entity';

export abstract class ProductRepository extends BasePaginatedRepository<Product> {
  abstract findByName(name: string): Promise<Product | null>;
}
