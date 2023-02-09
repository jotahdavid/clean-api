import { describe, expect, it } from 'vitest';

import { User } from '../entities/user';
import { UserRepositoryInMemory } from '../repositories/in-memory/user-repository-in-memory';
import { CreateUser } from './create-user';

describe('Create User', () => {
  it('Should be able to create a user', async () => {
    const userRepository = new UserRepositoryInMemory();

    const sut = new CreateUser(userRepository);

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
    const userRepository = new UserRepositoryInMemory();

    const sut = new CreateUser(userRepository);

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
