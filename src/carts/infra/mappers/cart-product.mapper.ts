import { CartProduct } from 'src/carts/domain/entities/cart-product.entity';

import { CartProductDto } from '../dtos/cart-product.dto';

export class CartProductMapper {
  static toDto(entity: CartProduct): CartProductDto {
    const dto = new CartProductDto();
    dto.id = entity._id;
    dto.price = entity.price;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.photoUrl = entity.photoUrl;
    dto.inCartQuantity = entity.inCartQuantity;
    return dto;
  }
}