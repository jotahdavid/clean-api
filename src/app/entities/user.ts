import { randomUUID } from 'crypto';

import { Optional } from '../../@types/Optional';

interface UserProps {
  id: string;
  name: string;
  email: string;
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

    if (!props.name) {
      throw new Error('Property name is empty');
    }
  }
}
