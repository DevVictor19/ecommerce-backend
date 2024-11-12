import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductFactory } from 'src/products/domain/factories/product.factory';

import { ProductService } from '../services/product.service';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    price: number,
    name: string,
    description: string,
    photoUrl: string,
    stockQuantity: number,
  ) {
    const existingProduct = await this.productService.findByName(name);

    if (existingProduct) {
      throw new BadRequestException('Product name already exists');
    }

    const product = ProductFactory.create(
      price,
      name,
      description,
      photoUrl,
      stockQuantity,
    );

    await this.productService.create(product);
  }
}
