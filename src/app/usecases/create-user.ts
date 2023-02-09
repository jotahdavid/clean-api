import { User } from '../entities/user';
import { IEncrypter } from '../ports/encrypter';
import { IUserRepository } from '../repositories/user-repository';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  birthday: Date;
}

export class CreateUser {
  constructor(
    public readonly userRepository: IUserRepository,
    public readonly encrypter: IEncrypter,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const isEmailAlreadyInUse = await this.userRepository.findByEmail(input.email);
    if (isEmailAlreadyInUse) {
      throw new Error(`The e-mail ${input.email} is already in use`);
    }

    const hashedPassword = await this.encrypter.make(input.password);

    const user = new User({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      birthday: input.birthday,
    });

    this.userRepository.save(user);

    return user;
  }
}
