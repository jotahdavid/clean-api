import JWT from 'jsonwebtoken';

import { ITokenGenerator } from '../ports/token-generator';

export class JWTAdapter implements ITokenGenerator {
  constructor(
    private readonly secret: string,
  ) {}

  generate(payload: string | object): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      JWT.sign(
        payload,
        this.secret,
        { algorithm: 'HS256' },
        (err, token) => (err ? reject(err) : resolve(token)),
      );
    });
  }
}
