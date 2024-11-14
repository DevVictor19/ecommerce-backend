import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/infra/orders.module';
import { ProductsModule } from 'src/products/infra/products.module';
import { UsersModule } from 'src/users/infra/users.module';

import { PaymentGateway } from '../application/gateways/payment-gateway.contract';
import { PayOrderWithCreditCardUseCase } from '../application/usecases/pay-order-with-credit-card.usecase';
import { PaymentController } from './controllers/payment.controller';
import { AsaasPaymentGateway } from './gateways/asaas/asaas-payment.gateway';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule],
  providers: [
    { provide: PaymentGateway, useClass: AsaasPaymentGateway },
    PayOrderWithCreditCardUseCase,
  ],
  controllers: [PaymentController],
})
export class PaymentsModule {}
