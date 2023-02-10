import { describe, expect, it } from 'vitest';

import { IEncrypter } from '../ports/encrypter';
import { UserRepositoryInMemory } from '../repositories/in-memory/user-repository-in-memory';
import { CreateUser } from '../usecases/create-user';
import { CreateUserController } from './create-user-controller';

const makeSut = () => {
  class EncrypterSpy implements IEncrypter {
    async make(value: string): Promise<string> {
      return value + Math.random();
    }

    compare(): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
  }
  const usersRepository = new UserRepositoryInMemory();
  const encrypter = new EncrypterSpy();
  const createUser = new CreateUser(usersRepository, encrypter);
  const sut = new CreateUserController(createUser);
  return {
    sut,
    usersRepository,
    encrypter,
    createUser,
  };
};

describe('Create User Controller', () => {
  it('Should return 422 if name property is missing', async () => {
    const { sut } = makeSut();
    const { statusCode } = await sut.handle({
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        birthday: new Date(+new Date() - 16000000),
      },
    });
    expect(statusCode).toBe(422);
  });

  it('Should return 422 if email property is missing', async () => {
    const { sut } = makeSut();
    const { statusCode } = await sut.handle({
      body: {
        name: 'any_name',
        password: 'any_password',
        birthday: new Date(+new Date() - 16000000),
      },
    });
    expect(statusCode).toBe(422);
  });

  it('Should return 422 if password property is missing', async () => {
    const { sut } = makeSut();
    const { statusCode } = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        birthday: new Date(+new Date() - 16000000),
      },
    });
    expect(statusCode).toBe(422);
  });

  it('Should return 422 if birthday property is missing', async () => {
    const { sut } = makeSut();
    const { statusCode } = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    });
    expect(statusCode).toBe(422);
  });

  it('Should return 201 with all required properties', async () => {
    const { sut } = makeSut();
    const { statusCode, body } = await sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        birthday: new Date(+new Date() - 16000000),
      },
    });
    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('email');
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('birthday');
  });
});
