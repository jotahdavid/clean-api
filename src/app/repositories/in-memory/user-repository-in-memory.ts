import { User } from '../../entities/user';
import { IUserRepository } from '../user-repository';

export class UserRepositoryInMemory implements IUserRepository {
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
