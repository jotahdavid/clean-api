import { IEncrypter } from '../ports/encrypter';
import { ITokenGenerator } from '../ports/token-generator';
import { IUserRepository } from '../repositories/user-repository';

interface AuthenticateUserInput {
  email: string;
  password: string;
}

export class AuthenticateUser {
  constructor(
    public readonly userRepository: IUserRepository,
    public readonly encrypter: IEncrypter,
    public readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<string> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('E-mail or password are invalid');
    }

    const isTheSamePassword = await this.encrypter.compare(input.password, user.password);
    if (!isTheSamePassword) {
      throw new Error('E-mail or password are invalid');
    }

    const acessToken = await this.tokenGenerator.generate({
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 3600 * 4,
    });
    if (!acessToken) {
      throw new Error('Something went wrong');
    }

    return acessToken;
  }
}
