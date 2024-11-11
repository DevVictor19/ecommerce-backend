import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigProvider } from 'src/shared/application/providers/EnvConfigProvider';

@Global()
@Injectable()
export class EnvConfigProviderImpl implements EnvConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.getOrThrow('DB_HOST');
  }

  getDatabaseName(): string {
    return this.configService.getOrThrow('DB_NAME');
  }

  getDatabaseUser(): string {
    return this.configService.getOrThrow('DB_USER');
  }

  getDatabasePassword(): string {
    return this.configService.getOrThrow('DB_PASSWORD');
  }

  getDatabasePort(): number {
    return this.configService.getOrThrow('DB_PORT');
  }

  getServerUrl(): string {
    return this.configService.getOrThrow('SERVER_URL');
  }

  getServerSecret(): string {
    return this.configService.getOrThrow('SERVER_SECRET');
  }

  getPaymentGatewayUrl(): string {
    return this.configService.getOrThrow('PAYMENT_GW_URL');
  }

  getPaymentGatewayKey(): string {
    return this.configService.getOrThrow('PAYMENT_GW_KEY');
  }
}
