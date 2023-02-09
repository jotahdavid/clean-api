import { User } from '../entities/user';
import { IUserRepository } from '../repositories/user-repository';

interface CreateUserInput {
  name: string;
  email: string;
  birthday: Date;
}

export class CreateUser {
  constructor(
    public readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const isEmailAlreadyInUse = await this.userRepository.findByEmail(input.email);
    if (isEmailAlreadyInUse) {
      throw new Error(`The e-mail ${input.email} is already in use`);
    }

    const user = new User({
      name: input.name,
      email: input.email,
      birthday: input.birthday,
    });

    this.userRepository.save(user);

    return user;
  }
}
