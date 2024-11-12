import { Injectable, NotFoundException } from '@nestjs/common';

import { ProductService } from '../services/product.service';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(productId: string) {
    const product = await this.productService.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productService.delete(product._id);
  }
}
