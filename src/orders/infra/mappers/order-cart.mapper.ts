import { CartDto } from '@/carts/infra/dtos/cart.dto';
import { CartProductMapper } from '@/carts/infra/mappers/cart-product.mapper';
import { OrderCart } from '@/orders/domain/entities/oder-cart.entity';

export class OrderCartMapper {
  static toDto(entity: OrderCart): CartDto {
    const dto = new CartDto();

    dto.id = entity._id;
    dto.products = entity.products.map(CartProductMapper.toDto);
    dto.productsQuantity = entity.productsQuantity;
    dto.totalPrice = entity.totalPrice;
    dto.createdAt = entity.createdAt.toISOString();

    return dto;
  }
}
