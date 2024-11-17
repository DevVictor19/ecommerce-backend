import * as bcrypt from 'bcrypt';

import { HashProvider } from '@/auth/application/providers/hash-provider.contract';

export class HashProviderImpl implements HashProvider {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(value, salt);
  }

  compare(value: string, encoded: string): Promise<boolean> {
    return bcrypt.compare(value, encoded);
  }
}
