import { z } from 'zod';

import { IController } from '../ports/controller';
import { HttpRequest, HttpResponse } from '../shared/http';
import { CreateUser } from '../usecases/create-user';

const userSchema = z.object({
  email: z.string().min(1).email(),
  name: z.string().min(1),
  password: z.string().min(4),
  birthday: z.preprocess((arg) => {
    if (typeof arg === 'string' || typeof arg === 'number') {
      return new Date(arg);
    }
    return arg;
  }, z.date().max(new Date(), 'Insert a old date')),
});

export class CreateUserController implements IController {
  constructor(
    private readonly createUser: CreateUser,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const validation = userSchema.safeParse(httpRequest.body);
    if (!validation.success) {
      return {
        statusCode: 422,
        body: {},
      };
    }

    const payload = validation.data;
    const createdUser = await this.createUser.execute(payload);

    return {
      statusCode: 201,
      body: createdUser,
    };
  }
}
