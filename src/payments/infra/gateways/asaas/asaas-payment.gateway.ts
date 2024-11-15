import { URLSearchParams } from 'node:url';

import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import axios, { AxiosInstance, isAxiosError } from 'axios';

import {
  Card,
  Charge,
  Customer,
  PaymentGateway,
} from '@/payments/application/gateways/payment-gateway.contract';
import { EnvConfigProvider } from '@/shared/application/providers/env-config-provider.contract';

import {
  CreateCreditCardChargeRequest,
  CreateCreditCardChargeResponse,
  CreateCustomerRequest,
  CreateCustomerResponse,
  findCustomerByDocumentResponse,
} from './asaas.contract';

export class AsaasPaymentGateway implements PaymentGateway {
  private readonly api: AxiosInstance;
  private readonly logger: Logger = new Logger(AsaasPaymentGateway.name);

  constructor(
    @Inject(EnvConfigProvider)
    envConfigProvider: EnvConfigProvider,
  ) {
    this.api = axios.create({
      baseURL: envConfigProvider.getPaymentGatewayUrl(),
      timeout: 1000 * 10,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `nestjs api - ${envConfigProvider.getServerUrl()}`,
        access_token: envConfigProvider.getPaymentGatewayKey(),
      },
    });
  }

  async createCustomer(
    name: string,
    email: string,
    document: string,
  ): Promise<Customer> {
    try {
      const body: CreateCustomerRequest = { document, email, name };

      const { data } = await this.api.post<CreateCustomerResponse>(
        '/customers',
        body,
      );

      return {
        id: data.id,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error(error.message);
      } else {
        this.logger.error('Failed to create a new customer');
      }

      throw new InternalServerErrorException('Failed to create a new customer');
    }
  }

  async findCustomerByDocument(document: string): Promise<Customer | null> {
    try {
      const { data } = await this.api.get<findCustomerByDocumentResponse>(
        '/customers',
        {
          params: new URLSearchParams({ document }),
        },
      );

      if (data.data.length === 0) return null;

      return data.data[0];
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error(error.message);
      } else {
        this.logger.error('Failed to find customer');
      }

      throw new InternalServerErrorException('Failed to find customer');
    }
  }

  async createCreditCardCharge(
    customerId: string,
    remoteIp: string,
    price: number,
    parcels: number,
    card: Card,
  ): Promise<Charge> {
    try {
      const totalPrice = price / 100; // the price come in cents
      const installmentValue = this.formatNumberPrecision(totalPrice / parcels);
      const dueDate = this.getDueDate();

      const body: CreateCreditCardChargeRequest = {
        billingType: 'CREDIT_CARD',
        card,
        customer: customerId,
        dueDate,
        installmentCount: parcels,
        installmentValue,
        remoteIp,
        value: totalPrice,
      };

      const { data } = await this.api.post<CreateCreditCardChargeResponse>(
        '/payments',
        body,
      );

      return {
        id: data.id,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error(error.message);
      } else {
        this.logger.error('Failed to create a credit card charge');
      }

      throw new InternalServerErrorException(
        'Failed to create a credit card charge',
      );
    }
  }

  private getDueDate(): string {
    const today = new Date();
    const offset = today.getTimezoneOffset(); // remove timezone offset
    const dateWithoutTz = new Date(today.getTime() - offset * 60 * 1000);
    const nextMonth = new Date(
      dateWithoutTz.getFullYear(),
      dateWithoutTz.getMonth() + 1,
      dateWithoutTz.getDate(),
    );

    return nextMonth.toISOString().split('T')[0];
  }

  private formatNumberPrecision(value: number): number {
    return Number(value.toFixed(2));
  }
}
