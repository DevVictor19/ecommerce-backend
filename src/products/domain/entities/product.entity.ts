import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InvalidEntityOperationException } from 'src/shared/domain/exceptions/invalid-entity-operation.exception';

@Schema({ collection: 'products' })
export class Product {
  @Prop()
  _id: string;

  @Prop()
  price: number;

  @Prop({ index: 'text' })
  name: string;

  @Prop()
  description: string;

  @Prop()
  photoUrl: string;

  @Prop()
  stockQuantity: number;

  @Prop()
  createdAt: Date;

  subtractFromStock(quantity: number) {
    if (quantity > this.stockQuantity) {
      throw new InvalidEntityOperationException(
        'Quantity to subtract not available on stock',
      );
    }

    this.stockQuantity -= quantity;
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
