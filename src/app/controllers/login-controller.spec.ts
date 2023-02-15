import { describe, expect, it } from 'vitest';
import crypto from 'crypto';

import { UserRepositoryInMemory } from '../repositories/in-memory/user-repository-in-memory';
import { AuthenticateUser } from '../usecases/authenticate-user';
import { LoginController } from './login-controller';
import { IEncrypter } from '../ports/encrypter';
import { ITokenGenerator } from '../ports/token-generator';
import { User } from '../entities/user';

const makeSut = () => {
  class EncrypterSpy implements IEncrypter {
    public isValid = true;

    make(): Promise<string> {
      throw new Error('Method not implemented.');
    }

    async compare(): Promise<boolean> {
      return this.isValid;
    }
  }
  class TokenGeneratorSpy implements ITokenGenerator {
    async generate(): Promise<string | undefined> {
      return crypto.randomUUID();
    }
  }
  const usersRepository = new UserRepositoryInMemory();
  const encrypter = new EncrypterSpy();
  const tokenGenerator = new TokenGeneratorSpy();
  const authenticateUser = new AuthenticateUser(usersRepository, encrypter, tokenGenerator);
  const sut = new LoginController(authenticateUser);
  return {
    sut,
    usersRepository,
    encrypter,
    tokenGenerator,
    authenticateUser,
  };
};

describe('Login Controller', () => {
  it('Should return 422 if email property was not provided', async () => {
    const { sut } = makeSut();
    const { statusCode, body } = await sut.handle({
      body: {
        password: 'any_password',
      },
    });
    expect(statusCode).toBe(422);
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Required at "email"');
  });

  it('Should return 422 if password property was not provided', async () => {
    const { sut } = makeSut();
    const { statusCode, body } = await sut.handle({
      body: {
        email: 'any_email@mail.com',
      },
    });
    expect(statusCode).toBe(422);
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Required at "password"');
  });

  it('Should return 422 if password property is empty', async () => {
    const { sut } = makeSut();
    const { statusCode, body } = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: '',
      },
    });
    expect(statusCode).toBe(422);
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('String must contain at least 4 character(s) at "password"');
  });

  it('Should return 422 if password property is less than 4 characters', async () => {
    const { sut } = makeSut();
    const response1 = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: '1',
      },
    });
    expect(response1.statusCode).toBe(422);
    expect(response1.body).toHaveProperty('error');
    expect(response1.body.error).toBe('String must contain at least 4 character(s) at "password"');
    const response2 = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: '123',
      },
    });
    expect(response2.statusCode).toBe(422);
    expect(response2.body).toHaveProperty('error');
    expect(response2.body.error).toBe('String must contain at least 4 character(s) at "password"');
  });

  it('Should return 403 if not exists user with the same email', async () => {
    const { sut } = makeSut();
    const { statusCode, body } = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    });
    expect(statusCode).toBe(403);
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('E-mail or password are invalid');
  });

  it('Should return 403 if user password is not the same', async () => {
    const { sut, usersRepository, encrypter } = makeSut();
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 8);
    const user = new User({
      name: 'any_name',
      password: 'any_password',
      email: 'any_email@mail.com',
      birthday,
    });
    await usersRepository.save(user);
    encrypter.isValid = false;
    const { statusCode, body } = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_other_password',
      },
    });
    expect(statusCode).toBe(403);
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('E-mail or password are invalid');
  });

  it('Should return 200 with all required properties and if user credentials match', async () => {
    const { sut, usersRepository } = makeSut();
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 8);
    const user = new User({
      name: 'any_name',
      password: 'any_password',
      email: 'any_email@mail.com',
      birthday,
    });
    await usersRepository.save(user);
    const { statusCode, body } = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    });
    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('token');
    expect(body.token).toBeTruthy();
  });
});
