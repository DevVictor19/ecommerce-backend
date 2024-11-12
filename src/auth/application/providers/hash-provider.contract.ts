export abstract class HashProvider {
  abstract hash(value: string): Promise<string>;
  abstract compare(value: string, encoded: string): Promise<boolean>;
}
