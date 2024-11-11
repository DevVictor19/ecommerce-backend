export abstract class EnvConfigProvider {
  abstract getDatabaseHost(): string;
  abstract getDatabaseName(): string;
  abstract getDatabaseUser(): string;
  abstract getDatabasePassword(): string;
  abstract getDatabasePort(): number;
  abstract getServerUrl(): string;
  abstract getServerSecret(): string;
  abstract getPaymentGatewayUrl(): string;
  abstract getPaymentGatewayKey(): string;
}
