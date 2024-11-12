import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/domain/entities/product.entity';
import { ProductRepository } from 'src/products/domain/repositories/product.repository';
import { SortOrder } from 'src/shared/domain/repositories/base-paginated-repository.contract';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  findAllPaginated(
    page: number,
    size: number,
    sort: SortOrder,
    sortBy: keyof Product,
    name?: string,
  ) {
    return this.productRepository.findAllPaginated({
      page,
      size,
      sort,
      sortBy,
      name,
    });
  }

  async create(product: Product) {
    await this.productRepository.insert(product);
  }

  async update(
    productId: string,
    fields: Partial<Omit<Product, '_id' | 'createdAt'>>,
  ) {
    await this.productRepository.update(productId, fields);
  }

  findByName(name: string) {
    return this.productRepository.findByName(name);
  }

  findById(id: string) {
    return this.productRepository.findById(id);
  }

  async delete(id: string) {
    await this.productRepository.delete(id);
  }
}
