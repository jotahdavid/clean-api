import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { User } from '../entities/user';
import { IEncrypter } from '../ports/encrypter';
import { UserRepositoryInMemory } from '../repositories/in-memory/user-repository-in-memory';
import { CreateUser } from './create-user';

class EncrypterSpy implements IEncrypter {
  async make(): Promise<string> {
    return randomUUID();
  }

  compare(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

const makeSut = () => {
  const userRepository = new UserRepositoryInMemory();
  const encrypter = new EncrypterSpy();

  const sut = new CreateUser(userRepository, encrypter);

  return { sut, userRepository };
};

describe('Create User', () => {
  it('Should be able to create a user', async () => {
    const { sut, userRepository } = makeSut();

    const birthday = new Date();
    birthday.setFullYear(new Date().getFullYear() - 10);

    const user = await sut.execute({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'any_password',
      birthday,
    });

    expect(user).toBeInstanceOf(User);
    expect(user.password).not.toBe('any_password');
    expect(user.id).not.to.be.empty;
    expect(userRepository.users).toHaveLength(1);
  });

  it('Should not be able to create a user if the email is already in use', async () => {
    const { sut, userRepository } = makeSut();

    const birthday = new Date();
    birthday.setFullYear(new Date().getFullYear() - 10);

    await sut.execute({
      name: 'valid_name_1',
      email: 'same@mail.com',
      password: 'any_password',
      birthday,
    });

    await expect(sut.execute({
      name: 'valid_name_2',
      email: 'same@mail.com',
      password: 'any_password',
      birthday,
    })).rejects.toThrow();
    expect(userRepository.users).toHaveLength(1);
  });
});
