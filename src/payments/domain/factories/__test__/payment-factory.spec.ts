import { Payment } from '@/payments/domain/entities/payment.entity';
import { PAYMENT_METHOD } from '@/payments/domain/enums/payment-method.enum';
import { PaymentFactory } from '@/payments/domain/factories/payment.factory';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(() => 'some-uuid'),
}));

describe('PaymentFactory', () => {
  describe('createForCreditCard', () => {
    it('should create a Payment entity with CREDIT_CART method', () => {
      const transactionCode = 'transaction-123';
      const price = 100;
      const parcels = 2;

      const payment = PaymentFactory.createForCreditCard(
        transactionCode,
        price,
        parcels,
      );

      expect(payment).toBeInstanceOf(Payment);
      expect(payment._id).toBe('some-uuid');
      expect(payment.createdAt).toBeInstanceOf(Date);
      expect(payment.method).toBe(PAYMENT_METHOD.CREDIT_CARD);
      expect(payment.parcels).toBe(parcels);
      expect(payment.price).toBe(price);
      expect(payment.transactionCode).toBe(transactionCode);
    });
  });

  describe('createForDebitCard', () => {
    it('should create a Payment entity with DEBIT_CARD method', () => {
      const transactionCode = 'transaction-456';
      const price = 50;

      const payment = PaymentFactory.createForDebitCard(transactionCode, price);

      expect(payment).toBeInstanceOf(Payment);
      expect(payment._id).toBe('some-uuid');
      expect(payment.createdAt).toBeInstanceOf(Date);
      expect(payment.method).toBe(PAYMENT_METHOD.DEBIT_CARD);
      expect(payment.parcels).toBe(0);
      expect(payment.price).toBe(price);
      expect(payment.transactionCode).toBe(transactionCode);
    });
  });
});
