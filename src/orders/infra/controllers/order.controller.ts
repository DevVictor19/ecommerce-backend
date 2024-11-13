import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/application/providers/jwt-provider.contract';
import { AuthenticatedRoute } from 'src/auth/infra/decorators/authenticated-route.decorator';
import {
  AdminPermission,
  ClientPermission,
} from 'src/auth/infra/decorators/roles.decorator';
import { CancelOrderUseCase } from 'src/orders/application/usecases/cancel-order.usecase';
import { CreateOrderUseCase } from 'src/orders/application/usecases/create-order.usecase';
import { FindAllOrdersUseCase } from 'src/orders/application/usecases/find-all-orders.usecase';
import { FindAllUserOrdersUseCase } from 'src/orders/application/usecases/find-all-user-orders.usecase';
import { FindOrderByIdUseCase } from 'src/orders/application/usecases/find-order-by-id.usecase';
import { Order } from 'src/orders/domain/entities/order.entity';
import { ORDER_STATUS } from 'src/orders/domain/enum/order-status.enum';
import {
  Page,
  SortOrder,
} from 'src/shared/domain/repositories/base-paginated-repository.contract';

import { OrderDto } from '../dtos/order.dto';
import { OrderMapper } from '../mappers/order.mapper';

@Controller('orders')
@AuthenticatedRoute()
export class OrderController {
  constructor(
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly findAllUserOrdersUseCase: FindAllUserOrdersUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
  ) {}

  @Get()
  @AdminPermission()
  findAllOrders(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('sort') sort: SortOrder = 'ASC',
    @Query('sortBy') sortBy: keyof Order = 'createdAt',
    @Query('status') status?: keyof typeof ORDER_STATUS,
  ): Promise<Page<OrderDto>> {
    return this.findAllOrdersUseCase
      .execute(page, size, sort, sortBy, status)
      .then((data) => ({
        content: data.content.map(OrderMapper.toDto),
        page: data.page,
      }));
  }

  @Get(':orderId')
  @ClientPermission()
  findOrderById(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderDto> {
    return this.findOrderByIdUseCase.execute(orderId).then(OrderMapper.toDto);
  }

  @Get('my-orders')
  @ClientPermission()
  findAllUserOrders(
    @Req() req: any,
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('sort') sort: SortOrder = 'ASC',
    @Query('sortBy') sortBy: keyof Order = 'createdAt',
    @Query('status') status?: keyof typeof ORDER_STATUS,
  ): Promise<Page<OrderDto>> {
    const user: JwtPayload = req.user;

    return this.findAllUserOrdersUseCase
      .execute(page, size, sort, sortBy, user.userId, status)
      .then((data) => ({
        content: data.content.map(OrderMapper.toDto),
        page: data.page,
      }));
  }

  @Post('my-orders')
  @ClientPermission()
  async createOrder(@Req() req: any) {
    const user: JwtPayload = req.user;

    await this.createOrderUseCase.execute(user.userId);
  }

  @Delete('my-orders/:orderId')
  @ClientPermission()
  async cancelOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Req() req: any,
  ) {
    const user: JwtPayload = req.user;

    await this.cancelOrderUseCase.execute(orderId, user.userId);
  }
}
