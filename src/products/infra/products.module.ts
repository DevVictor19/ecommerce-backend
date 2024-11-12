import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductService } from '../application/services/product.service';
import { CreateProductUseCase } from '../application/usecases/create-product.usecase';
import { DeleteProductUseCase } from '../application/usecases/delete-product.usecase';
import { FindAllProductsUseCase } from '../application/usecases/find-all-products.usecase';
import { FindProductByIdUseCase } from '../application/usecases/find-product-by-id.usecase';
import { UpdateProductUseCase } from '../application/usecases/update-product.usecase';
import { Product, ProductSchema } from '../domain/entities/product.entity';
import { ProductRepository } from '../domain/repositories/product.repository';
import { ProductController } from './controllers/product.controller';
import { MongoProductRepository } from './repositories/mongo-product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [
    { provide: ProductRepository, useClass: MongoProductRepository },
    ProductService,
    CreateProductUseCase,
    DeleteProductUseCase,
    FindAllProductsUseCase,
    FindProductByIdUseCase,
    UpdateProductUseCase,
  ],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductsModule {}
