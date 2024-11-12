import { Product } from 'src/products/domain/entities/product.entity';

import { ProductDto } from '../dtos/product.dto';

export class ProductMapper {
  static toDto(entity: Product): ProductDto {
    const dto = new ProductDto();

    dto.id = entity._id;
    dto.price = entity.price;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.photoUrl = entity.photoUrl;
    dto.stockQuantity = entity.stockQuantity;
    dto.createdAt = entity.createdAt.toISOString();

    return dto;
  }
}
