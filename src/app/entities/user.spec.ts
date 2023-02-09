import { describe, expect, it } from 'vitest';

import { User } from './user';

describe('User', () => {
  it('Should create a User', () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 10);

    const user = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      birthday,
    };
    const sut = new User(user);

    expect(sut).toBeInstanceOf(User);
    expect(sut.props).toEqual(user);
  });

  it('Should create a User if not pass id', () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 10);

    const user = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      birthday,
    };
    const sut = new User(user);

    expect(sut).toBeInstanceOf(User);
    expect(sut.props.id).to.be.not.empty;
  });

  it('Should not create a User with a future date as birthday', () => {
    const invalidBirthday = new Date();
    invalidBirthday.setFullYear(invalidBirthday.getFullYear() + 2);

    expect(() => new User({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      birthday: invalidBirthday,
    })).toThrow();
  });

  it('Should not create a User if email is empty', () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 10);

    expect(() => new User({
      id: 'valid_id',
      name: 'valid_name',
      email: '',
      birthday,
    })).toThrow();
  });

  it('Should not create a User if name is empty', () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 10);

    expect(() => new User({
      id: 'valid_id',
      name: '',
      email: 'valid_email@mail.com',
      birthday,
    })).toThrow();
  });
});