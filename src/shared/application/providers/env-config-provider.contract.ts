export abstract class EnvConfigProvider {
  abstract getDatabaseUri(): string;
  abstract getDatabaseName(): string;
  abstract getDatabaseUser(): string;
  abstract getDatabasePassword(): string;
  abstract getServerUrl(): string;
  abstract getServerSecret(): string;
  abstract getServerPort(): number;
  abstract getServerFrontendUrl(): string;
  abstract getPaymentGatewayUrl(): string;
  abstract getPaymentGatewayKey(): string;
}
