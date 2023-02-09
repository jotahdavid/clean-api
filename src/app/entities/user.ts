import { randomUUID } from 'crypto';

import { Optional } from '../../@types/Optional';
import { isEmail } from '../../utils/isEmail';

interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  birthday: Date;
}

export class User {
  public readonly props: UserProps;

  constructor(props: Optional<UserProps, 'id'>) {
    this.props = {
      ...props,
      id: props.id || randomUUID(),
    };

    if (props.birthday >= new Date()) {
      throw new Error('Invalid birthday date');
    }

    if (!props.email) {
      throw new Error('Property email is empty');
    }

    if (!isEmail(props.email)) {
      throw new Error('Invalid email');
    }

    if (!props.name) {
      throw new Error('Property name is empty');
    }

    if (!props.password || props.password.length < 4) {
      throw new Error('Property password must have at least 4 characters');
    }
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get birthday() {
    return this.props.birthday;
  }
}
