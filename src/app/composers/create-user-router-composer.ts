import { BCryptAdapter } from '../adapters/bcrypt-adapter';
import { CreateUserController } from '../controllers/create-user-controller';
import { UserRepositoryInMemory } from '../repositories/in-memory/user-repository-in-memory';
import { CreateUser } from '../usecases/create-user';

export class CreateUserRouterComposer {
  static compose(): CreateUserController {
    const usersRepository = new UserRepositoryInMemory();
    const encrypter = new BCryptAdapter();
    const createUser = new CreateUser(usersRepository, encrypter);
    return new CreateUserController(createUser);
  }
}
