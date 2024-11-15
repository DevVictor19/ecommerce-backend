import { faker } from '@faker-js/faker/.';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CartService } from '@/carts/application/services/cart.service';
import {
  createCartEntity,
  createCartProductEntity,
} from '@/carts/domain/factories/__test__/helpers/cart.helpers';
import { CartRepository } from '@/carts/domain/repositories/cart.repository';

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository: jest.Mocked<CartRepository>;

  beforeEach(() => {
    cartRepository = {
      delete: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      insert: jest.fn(),
    };

    cartService = new CartService(cartRepository);
  });

  describe('create()', () => {
    it('should create a cart', async () => {
      const cart = createCartEntity();

      await cartService.create(cart);

      expect(cartRepository.insert).toHaveBeenCalledWith(cart);
    });
  });

  describe('update()', () => {
    it('should update a cart', async () => {
      const cart = createCartEntity();

      await cartService.update(cart);

      expect(cartRepository.update).toHaveBeenCalledWith(cart._id, {
        products: cart.products,
        totalPrice: cart.totalPrice,
        productsQuantity: cart.productsQuantity,
      });
    });
  });

  describe('findByUserId()', () => {
    it('should find a cart by userId', () => {
      const userId = 'user-id';

      cartService.findByUserId(userId);

      expect(cartRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('delete()', () => {
    it('should delete a cart by cartId', async () => {
      const cartId = 'cart-id';

      await cartService.delete(cartId);

      expect(cartRepository.delete).toHaveBeenCalledWith(cartId);
    });
  });

  describe('addCartProduct()', () => {
    it('should add a product to the cart', () => {
      const cart = createCartEntity();

      const productInCartQuantity = faker.number.int({ max: 30 });
      const productPrice = faker.number.int({ min: 1000, max: 10000 });

      const product = createCartProductEntity({
        inCartQuantity: productInCartQuantity,
        price: productPrice,
      });

      cartService.addCartProduct(cart, product);

      expect(cart.products).toContain(product);
      expect(cart.productsQuantity).toBe(productInCartQuantity);
      expect(cart.totalPrice).toBe(productInCartQuantity * productPrice);
    });

    it('should throw an error if quantity to add is non-positive', () => {
      const cart = createCartEntity();

      const product = createCartProductEntity({
        inCartQuantity: 0,
      });

      expect(() => cartService.addCartProduct(cart, product)).toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if quantity to add pass the maximum cart capacity', () => {
      const maximumCartCapacity = 30;

      const cart = createCartEntity();

      const product = createCartProductEntity({
        inCartQuantity: maximumCartCapacity + 1,
        price: 1000,
      });

      expect(() => cartService.addCartProduct(cart, product)).toThrow(
        BadRequestException,
      );
    });

    it('should increment the existing product in cart quantity if exists', () => {
      const productId = 'product-id';

      const p1 = createCartProductEntity({
        _id: productId,
        inCartQuantity: 1,
        price: 1000,
      });

      const cart = createCartEntity({
        products: [p1],
        totalPrice: p1.price,
        productsQuantity: p1.inCartQuantity,
      });

      const p2 = createCartProductEntity({
        _id: productId,
        inCartQuantity: 1,
        price: 1000,
      });

      cartService.addCartProduct(cart, p2);

      expect(cart.totalPrice).toBe(2000);
      expect(cart.productsQuantity).toBe(2);
      expect(cart.products[0].inCartQuantity).toBe(2);
    });

    it('should throw an error if price to add is non-positive', () => {
      const cart = createCartEntity({
        totalPrice: -100,
      });

      const product = createCartProductEntity({
        inCartQuantity: 2,
      });

      expect(() => cartService.addCartProduct(cart, product)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('subtractCartProduct()', () => {
    it('should subtract a product from the cart', () => {
      const productId = 'product-id';

      const productInCartQuantity = faker.number.int({ min: 1, max: 30 });
      const productPrice = faker.number.int({ min: 1000, max: 10000 });

      const cartProduct = createCartProductEntity({
        _id: productId,
        price: productPrice,
        inCartQuantity: productInCartQuantity,
      });

      const cartTotalPrice = productInCartQuantity * productPrice;

      const cart = createCartEntity({
        products: [cartProduct],
        productsQuantity: productInCartQuantity,
        totalPrice: cartTotalPrice,
      });

      const quantityToSub = 1;

      cartService.subtractCartProduct(cart, productId, quantityToSub);

      const updatedCartTotalPrice =
        cartTotalPrice - productPrice * quantityToSub;

      expect(cart.productsQuantity).toBe(productInCartQuantity - quantityToSub);
      expect(cart.totalPrice).toBe(updatedCartTotalPrice);
    });

    it('should throw an error if product its not present in cart', () => {
      const cart = createCartEntity();

      expect(() =>
        cartService.subtractCartProduct(cart, 'product-id', 1),
      ).toThrow(NotFoundException);
    });

    it('should throw an error if product in cart quantity is less than zero', () => {
      const productId = 'product-id';

      const product = createCartProductEntity({
        _id: productId,
        price: 1000,
        inCartQuantity: 2,
      });

      const cart = createCartEntity({
        products: [product],
        totalPrice: product.price,
        productsQuantity: product.inCartQuantity,
      });

      expect(() =>
        cartService.subtractCartProduct(
          cart,
          productId,
          product.inCartQuantity + 1,
        ),
      ).toThrow(BadRequestException);
    });

    it('should remove the product from cart if his in cart quantity equals zero', () => {
      const productId = 'product-id';

      const product = createCartProductEntity({
        _id: productId,
        price: 1000,
        inCartQuantity: 2,
      });

      const cart = createCartEntity({
        products: [product],
        totalPrice: product.price * product.inCartQuantity,
        productsQuantity: product.inCartQuantity,
      });

      cartService.subtractCartProduct(cart, productId, product.inCartQuantity);

      expect(cart.totalPrice).toBe(0);
      expect(cart.productsQuantity).toBe(0);
      expect(cart.products.length).toBe(0);
    });

    it('should throw an error if total price is less than zero', () => {
      const productId = 'product-id';

      const product = createCartProductEntity({
        _id: productId,
        price: 1000,
        inCartQuantity: 2,
      });

      const cart = createCartEntity({
        products: [product],
        totalPrice: -1000,
        productsQuantity: product.inCartQuantity,
      });

      expect(() =>
        cartService.subtractCartProduct(
          cart,
          productId,
          product.inCartQuantity,
        ),
      ).toThrow(BadRequestException);
    });
  });
});
