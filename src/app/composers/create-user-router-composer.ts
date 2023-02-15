import { BCryptAdapter } from '../adapters/bcrypt-adapter';
import { CreateUserController } from '../controllers/create-user-controller';
import { userRepository } from '../repositories/in-memory/user-repository-in-memory';
import { CreateUser } from '../usecases/create-user';

export class CreateUserRouterComposer {
  static compose(): CreateUserController {
    const encrypter = new BCryptAdapter();
    const createUser = new CreateUser(userRepository, encrypter);
    return new CreateUserController(createUser);
  }
}
