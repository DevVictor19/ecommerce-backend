import { Payment } from '@/payments/domain/entities/payment.entity';
import { PAYMENT_METHOD } from '@/payments/domain/enums/payment-method.enum';
import { PaymentDto } from '@/payments/infra/dtos/payment.dto';
import { PaymentMapper } from '@/payments/infra/mappers/payment.mapper';

describe('PaymentMapper', () => {
  it('should map a Payment entity to PaymentDto', () => {
    const paymentEntity: Payment = {
      _id: 'payment-id',
      transactionCode: 'transaction-code',
      price: 100,
      method: PAYMENT_METHOD.CREDIT_CARD,
      parcels: 3,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    };

    const paymentDto: PaymentDto = PaymentMapper.toDto(paymentEntity);

    expect(paymentDto.id).toBe(paymentEntity._id);
    expect(paymentDto.price).toBe(paymentEntity.price);
    expect(paymentDto.method).toBe(paymentEntity.method);
    expect(paymentDto.parcels).toBe(paymentEntity.parcels);
    expect(paymentDto.createdAt).toBe(paymentEntity.createdAt.toISOString());
  });
});
