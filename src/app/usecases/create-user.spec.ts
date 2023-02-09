import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';

import { User } from '../entities/user';
import { IEncrypter } from '../ports/encrypter';
import { UserRepositoryInMemory } from '../repositories/in-memory/user-repository-in-memory';
import { CreateUser } from './create-user';

class EncrypterMock implements IEncrypter {
  public isValid: boolean = true;

  async make(): Promise<string> {
    return randomUUID();
  }

  async compare(): Promise<boolean> {
    return this.isValid;
  }
}

const makeSut = () => {
  const userRepository = new UserRepositoryInMemory();
  const encrypter = new EncrypterMock();

  const sut = new CreateUser(userRepository, encrypter);

  return { sut, userRepository };
};

describe('Create User', () => {
  it('Should be able to create a user', async () => {
    const { sut, userRepository } = makeSut();

    const birthday = new Date();
    birthday.setFullYear(new Date().getFullYear() - 10);

    await expect(sut.execute({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'any_password',
      birthday,
    })).resolves.toBeInstanceOf(User);
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
