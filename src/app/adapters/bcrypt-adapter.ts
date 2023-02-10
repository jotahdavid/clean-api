import bcrypt from 'bcryptjs';

import { IEncrypter } from '../ports/encrypter';

export class BCryptAdapter implements IEncrypter {
  make(value: string): Promise<string> {
    return bcrypt.hash(value, 8);
  }

  compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
