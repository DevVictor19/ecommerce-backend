import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/domain/entities/product.entity';
import { SortOrder } from 'src/shared/domain/repositories/base-paginated-repository.contract';

import { ProductService } from '../services/product.service';

@Injectable()
export class FindAllProductsUseCase {
  constructor(private readonly productService: ProductService) {}

  execute(
    page: number,
    size: number,
    sort: SortOrder,
    sortBy: keyof Product,
    name?: string,
  ) {
    return this.productService.findAllPaginated(page, size, sort, sortBy, name);
  }
}
