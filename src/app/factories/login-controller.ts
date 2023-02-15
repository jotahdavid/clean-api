import { BCryptAdapter } from '../adapters/bcrypt-adapter';
import { JWTAdapter } from '../adapters/jwt-adapter';
import { LoginController } from '../controllers/login-controller';
import { userRepository } from '../repositories/in-memory/user-repository-in-memory';
import { AuthenticateUser } from '../usecases/authenticate-user';

export function makeLoginController(): LoginController {
  const encrypter = new BCryptAdapter();
  const tokenGenerator = new JWTAdapter('SECRET_KEY');
  const authenticateUser = new AuthenticateUser(userRepository, encrypter, tokenGenerator);
  return new LoginController(authenticateUser);
}
