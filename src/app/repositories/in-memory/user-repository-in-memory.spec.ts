import { describe, expect, it } from 'vitest';

import { UserRepositoryInMemory } from './user-repository-in-memory';
import { User } from '../../entities/user';

describe('User Repository In Memory', () => {
  it('Should be able to save a user', async () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 18);

    const user = new User({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      birthday,
    });

    const sut = new UserRepositoryInMemory();
    await sut.save(user);

    expect(sut.users).toHaveLength(1);
  });

  it('Should be able to find a user by id', async () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 18);

    const user = new User({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      birthday,
    });

    const sut = new UserRepositoryInMemory();
    await sut.save(user);

    expect(sut.users).toHaveLength(1);
    expect(sut.findById(user.id)).resolves.toBeInstanceOf(User);
  });

  it('Should not be able to find a user by id that not exists', async () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 18);

    const user = new User({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      birthday,
    });

    const sut = new UserRepositoryInMemory();
    await sut.save(user);

    expect(sut.users).toHaveLength(1);
    expect(sut.findById('id_not_exists')).resolves.toBeNull();
  });

  it('Should be able to find a user by email', async () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 18);

    const user = new User({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      birthday,
    });

    const sut = new UserRepositoryInMemory();
    await sut.save(user);

    expect(sut.users).toHaveLength(1);
    expect(sut.findByEmail(user.email)).resolves.toBeInstanceOf(User);
  });

  it('Should not be able to find a user by email that not exists', async () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 18);

    const user = new User({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      birthday,
    });

    const sut = new UserRepositoryInMemory();
    await sut.save(user);

    expect(sut.users).toHaveLength(1);
    expect(sut.findByEmail('email_that_not_exists@mail.com')).resolves.toBeNull();
  });
});
