import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { JwtPayload } from 'src/auth/application/providers/jwt-provider.contract';
import { AuthenticatedRoute } from 'src/auth/infra/decorators/authenticated-route.decorator';
import { ClientPermission } from 'src/auth/infra/decorators/roles.decorator';
import { AddProductToCartUseCase } from 'src/carts/application/usecases/add-product-to-cart.usecase';
import { ClearCartUseCase } from 'src/carts/application/usecases/clear-cart.usecase';
import { FindUserCartUseCase } from 'src/carts/application/usecases/find-user-cart.usecase';
import { SubtractProductFromCartUseCase } from 'src/carts/application/usecases/subtract-product-from-cart.usecase';

import { CartMapper } from '../mappers/cart.mapper';

@Controller('/carts')
@AuthenticatedRoute()
@ClientPermission()
export class CartController {
  constructor(
    private readonly addProductToCartUseCase: AddProductToCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
    private readonly findUserCartUseCase: FindUserCartUseCase,
    private readonly subtractProductFromCartUseCase: SubtractProductFromCartUseCase,
  ) {}

  @Get('/my-cart')
  async findUserCart(@Req() req: any, @Res() res: FastifyReply) {
    const loggedUser: JwtPayload = req.user;

    const cart = await this.findUserCartUseCase.execute(loggedUser.userId);

    if (!cart) {
      return res.code(HttpStatus.NO_CONTENT).send();
    }

    return res.send(CartMapper.toDto(cart));
  }

  @Delete('/my-cart')
  async clearCart(@Req() req: any) {
    const loggedUser: JwtPayload = req.user;

    await this.clearCartUseCase.execute(loggedUser.userId);
  }

  @Post('/my-cart/products/:productId')
  async addProductToCart(
    @Req() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    const loggedUser: JwtPayload = req.user;

    await this.addProductToCartUseCase.execute(
      productId,
      loggedUser.userId,
      quantity,
    );
  }

  @Delete('/my-cart/products/:productId')
  async subtractProductFromCart(
    @Req() req: any,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    const loggedUser: JwtPayload = req.user;

    await this.subtractProductFromCartUseCase.execute(
      productId,
      loggedUser.userId,
      quantity,
    );
  }
}
