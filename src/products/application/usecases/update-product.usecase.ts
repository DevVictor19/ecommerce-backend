import { BadRequestException, Injectable } from '@nestjs/common';

import { ProductService } from '../services/product.service';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    productId: string,
    price: number,
    name: string,
    description: string,
    photoUrl: string,
    stockQuantity: number,
  ) {
    const product = await this.productService.findByName(name);

    if (product) {
      throw new BadRequestException('Product name already exists');
    }

    await this.productService.update(productId, {
      price,
      name,
      description,
      photoUrl,
      stockQuantity,
    });
  }
}
