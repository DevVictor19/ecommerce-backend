import { Injectable } from '@nestjs/common';

import { CartService } from '../services/cart.service';

@Injectable()
export class FindUserCartUseCase {
  constructor(private readonly cartService: CartService) {}

  execute(userId: string) {
    return this.cartService.findByUserId(userId);
  }
}