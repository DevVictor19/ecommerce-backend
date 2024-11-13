import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigProvider } from 'src/shared/application/providers/env-config-provider.contract';

@Global()
@Injectable()
export class EnvConfigProviderImpl implements EnvConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  getDatabaseUri(): string {
    return this.configService.getOrThrow('DB_URI');
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

  getServerUrl(): string {
    return this.configService.getOrThrow('SERVER_URL');
  }

  getServerSecret(): string {
    return this.configService.getOrThrow('SERVER_SECRET');
  }

  getServerPort(): number {
    return this.configService.getOrThrow('SERVER_PORT');
  }

  getServerFrontendUrl(): string {
    return this.configService.getOrThrow('SERVER_FRONTEND_URL');
  }

  getPaymentGatewayUrl(): string {
    return this.configService.getOrThrow('PAYMENT_GW_URL');
  }

  getPaymentGatewayKey(): string {
    return this.configService.getOrThrow('PAYMENT_GW_KEY');
  }
}
