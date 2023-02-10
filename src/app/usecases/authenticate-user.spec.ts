/* eslint-disable max-classes-per-file */
import { describe, expect, it } from 'vitest';

import { User } from '../entities/user';
import { IEncrypter } from '../ports/encrypter';
import { UserRepositoryInMemory } from '../repositories/in-memory/user-repository-in-memory';
import { IUserRepository } from '../repositories/user-repository';

interface AuthenticateUserInput {
  email: string;
  password: string;
}

class AuthenticateUser {
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

interface ITokenGenerator {
  readonly secret: string;
  generate(payload: string | object): Promise<string | undefined>;
}

class TokenGeneratorSpy implements ITokenGenerator {
  constructor(
    readonly secret: string,
  ) {}

  async generate(): Promise<string | undefined> {
    return this.secret;
  }
}

class EncrypterSpy implements IEncrypter {
  public isValidPassword = true;

  make(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async compare(): Promise<boolean> {
    return this.isValidPassword;
  }
}

describe('Auth User', () => {
  it('Should be able to auth user', async () => {
    const usersRepository = new UserRepositoryInMemory();
    const user = new User({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
      birthday: new Date(+new Date() - 160000000000),
    });
    usersRepository.users.push(user);

    const encrypter = new EncrypterSpy();
    const tokenGenerator = new TokenGeneratorSpy('1234');

    const sut = new AuthenticateUser(usersRepository, encrypter, tokenGenerator);

    const acessToken = await sut.execute({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(acessToken).toBeTruthy();
    expect(acessToken).toBe('1234');
  });

  it('Should not be able to auth user if user not exists', async () => {
    const usersRepository = new UserRepositoryInMemory();
    const encrypter = new EncrypterSpy();
    const tokenGenerator = new TokenGeneratorSpy('1234');

    const sut = new AuthenticateUser(usersRepository, encrypter, tokenGenerator);

    await expect(sut.execute({
      email: 'any_email@mail.com',
      password: 'any_password',
    })).rejects.toThrow('E-mail or password are invalid');
  });

  it('Should not be able to auth user if password is incorrect', async () => {
    const usersRepository = new UserRepositoryInMemory();
    const user = new User({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
      birthday: new Date(+new Date() - 160000000000),
    });
    usersRepository.users.push(user);

    const encrypter = new EncrypterSpy();
    encrypter.isValidPassword = false;

    const tokenGenerator = new TokenGeneratorSpy('1234');

    const sut = new AuthenticateUser(usersRepository, encrypter, tokenGenerator);

    await expect(sut.execute({
      email: 'any_email@mail.com',
      password: 'any_password',
    })).rejects.toThrow('E-mail or password are invalid');
  });
});
