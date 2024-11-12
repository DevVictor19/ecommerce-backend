import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductUseCase } from 'src/products/application/usecases/create-product.usecase';
import { DeleteProductUseCase } from 'src/products/application/usecases/delete-product.usecase';
import { FindAllProductsUseCase } from 'src/products/application/usecases/find-all-products.usecase';
import { FindProductByIdUseCase } from 'src/products/application/usecases/find-product-by-id.usecase';
import { UpdateProductUseCase } from 'src/products/application/usecases/update-product.usecase';
import { Product } from 'src/products/domain/entities/product.entity';
import {
  Page,
  SortOrder,
} from 'src/shared/domain/repositories/base-paginated-repository.contract';

import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductMapper } from '../mappers/product.mapper';

@Controller('/products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    await this.createProductUseCase.execute(
      dto.price,
      dto.name,
      dto.description,
      dto.photoUrl,
      dto.stockQuantity,
    );
  }

  @Delete(':productId')
  async delete(@Param('productId', ParseUUIDPipe) productId: string) {
    await this.deleteProductUseCase.execute(productId);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('sort') sort: SortOrder = 'ASC',
    @Query('sortBy') sortBy: keyof Product = 'createdAt',
    @Query('name') name: string,
  ): Promise<Page<ProductDto>> {
    return this.findAllProductsUseCase
      .execute(page, size, sort, sortBy, name)
      .then((data) => ({
        content: data.content.map(ProductMapper.toDto),
        page: data.page,
      }));
  }

  @Get(':productId')
  findById(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductDto> {
    return this.findProductByIdUseCase
      .execute(productId)
      .then(ProductMapper.toDto);
  }

  @Put(':productId')
  async update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    await this.updateProductUseCase.execute(
      productId,
      dto.price,
      dto.name,
      dto.description,
      dto.photoUrl,
      dto.stockQuantity,
    );
  }
}
