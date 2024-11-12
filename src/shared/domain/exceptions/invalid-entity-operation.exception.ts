import { DomainException } from './domain.exception';

export class InvalidEntityOperationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
