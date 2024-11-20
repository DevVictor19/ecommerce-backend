import { OrderCart } from '@/orders/domain/entities/oder-cart.entity';
import { Order } from '@/orders/domain/entities/order.entity';
import { ORDER_STATUS } from '@/orders/domain/enum/order-status.enum';
import { OrderFactory } from '@/orders/domain/factories/order.factory';

describe('OrderFactory', () => {
  it('should create an Order entity with the correct properties', () => {
    const userId = 'user-id';
    const cart: OrderCart = {
      _id: 'id',
      products: [
        {
          _id: 'id',
          description: 'description',
          inCartQuantity: 1,
          name: 'name',
          photoUrl: 'photo-url',
          price: 1000,
        },
      ],
      productsQuantity: 1,
      totalPrice: 2000,
      createdAt: new Date(),
    };

    const result = OrderFactory.create(userId, cart);

    expect(result).toBeInstanceOf(Order);
    expect(result._id).toBeDefined();
    expect(result.userId).toBe(userId);
    expect(result.cart).toEqual(cart);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.payment).toBeNull();
    expect(result.status).toBe(ORDER_STATUS.WAITING_PAYMENT);
  });
});
