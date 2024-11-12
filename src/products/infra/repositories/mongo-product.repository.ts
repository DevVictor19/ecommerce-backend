import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/products/domain/entities/product.entity';
import { ProductRepository } from 'src/products/domain/repositories/product.repository';
import { BasePaginatedMongoRepository } from 'src/shared/infra/repositories/base-paginated-mongo.repository';

export class MongoProductRepository
  extends BasePaginatedMongoRepository<Product>
  implements ProductRepository
{
  constructor(@InjectModel(Product.name) productModel: Model<Product>) {
    super(productModel);
  }

  findByName(name: string): Promise<Product | null> {
    return this.model.findOne({ name });
  }
}
