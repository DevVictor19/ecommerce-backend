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

import { AuthenticatedRoute } from '@/auth/infra/decorators/authenticated-route.decorator';
import {
  AdminPermission,
  ClientPermission,
} from '@/auth/infra/decorators/roles.decorator';
import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { DeleteProductUseCase } from '@/products/application/usecases/delete-product.usecase';
import { FindAllProductsUseCase } from '@/products/application/usecases/find-all-products.usecase';
import { FindProductByIdUseCase } from '@/products/application/usecases/find-product-by-id.usecase';
import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase';
import { Product } from '@/products/domain/entities/product.entity';
import {
  Page,
  SortOrder,
} from '@/shared/domain/repositories/base-paginated-repository.contract';

import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductMapper } from '../mappers/product.mapper';

@Controller('/products')
@AuthenticatedRoute()
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  @Post()
  @AdminPermission()
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
  @AdminPermission()
  async delete(@Param('productId', ParseUUIDPipe) productId: string) {
    await this.deleteProductUseCase.execute(productId);
  }

  @Get()
  @ClientPermission()
  findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('sort') sort: SortOrder = 'DESC',
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
  @ClientPermission()
  findById(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductDto> {
    return this.findProductByIdUseCase
      .execute(productId)
      .then(ProductMapper.toDto);
  }

  @Put(':productId')
  @AdminPermission()
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
