import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/application/providers/jwt-provider.contract';
import { AuthenticatedRoute } from 'src/auth/infra/decorators/authenticated-route.decorator';
import { ClientPermission } from 'src/auth/infra/decorators/roles.decorator';
import { PayOrderWithCreditCardUseCase } from 'src/payments/application/usecases/pay-order-with-credit-card.usecase';

import { CreateCreditCardChargeDto } from '../dtos/create-credit-card-charge.dto';

@Controller('payments')
@AuthenticatedRoute()
export class PaymentController {
  constructor(
    private readonly payOrderWithCreditCardUseCase: PayOrderWithCreditCardUseCase,
  ) {}

  @Post('credit/orders/:orderId')
  @ClientPermission()
  async payWithCreditCard(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Req() req: any,
    @Body() dto: CreateCreditCardChargeDto,
  ) {
    const { userId }: JwtPayload = req.user;
    const remoteIp = req.ip;

    await this.payOrderWithCreditCardUseCase.execute(
      orderId,
      userId,
      remoteIp,
      dto.document,
      dto.parcels,
      dto.card,
    );
  }
}
