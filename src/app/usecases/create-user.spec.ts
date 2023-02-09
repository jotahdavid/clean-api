import { describe, expect, it } from 'vitest';

import { User } from '../entities/user';
import { IUserRepository } from '../repositories/user-repository';
import { CreateUser } from './create-user';

describe('Create User', () => {
  class UserRepositoryInMemory implements IUserRepository {
    users: User[] = [];

    async save(user: User): Promise<void> {
      this.users.push(user);
    }

    async findById(userId: string): Promise<User | null> {
      const userFound = this.users.find((user) => user.id === userId);
      return userFound ?? null;
    }

    async findByEmail(email: string): Promise<User | null> {
      const userFound = this.users.find((user) => user.email === email);
      return userFound ?? null;
    }
  }

  it('Should be able to create a user', async () => {
    const userRepository = new UserRepositoryInMemory();

    const sut = new CreateUser(userRepository);

    const birthday = new Date();
    birthday.setFullYear(new Date().getFullYear() - 10);

    await expect(sut.execute({
      name: 'valid_name',
      email: 'valid_email@mail.com',
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
      birthday,
    });

    await expect(sut.execute({
      name: 'valid_name_2',
      email: 'same@mail.com',
      birthday,
    })).rejects.toThrow();
    expect(userRepository.users).toHaveLength(1);
  });
});
