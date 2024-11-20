import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CartProduct } from '@/carts/domain/entities/cart-product.entity';
import { Product } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { SortOrder } from '@/shared/domain/repositories/base-paginated-repository.contract';

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

  async isAllProductsAvailable(products: CartProduct[]) {
    const promises: Promise<boolean>[] = products.map(async (cartProduct) => {
      const stockProduct = await this.productRepository.findById(
        cartProduct._id,
      );

      if (!stockProduct) return false;

      return stockProduct.stockQuantity >= cartProduct.inCartQuantity;
    });

    const results = await Promise.all(promises);

    return results.every((v) => v);
  }

  async subtractProductsFromStock(products: CartProduct[]) {
    const promises: Promise<void>[] = products.map(async (cartProduct) => {
      const stockProduct = await this.productRepository.findById(
        cartProduct._id,
      );

      if (!stockProduct) {
        throw new NotFoundException('Product not found');
      }

      if (stockProduct.stockQuantity < cartProduct.inCartQuantity) {
        throw new BadRequestException(
          'Insufficient quantity of product in stock"',
        );
      }

      stockProduct.stockQuantity -= cartProduct.inCartQuantity;

      await this.productRepository.update(stockProduct._id, {
        stockQuantity: stockProduct.stockQuantity,
      });
    });

    await Promise.all(promises);
  }
}
