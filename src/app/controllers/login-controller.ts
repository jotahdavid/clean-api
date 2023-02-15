import { z } from 'zod';

import { IController } from '../ports/controller';
import { HttpRequest, HttpResponse } from '../shared/http';
import { AuthenticateUser } from '../usecases/authenticate-user';
import { formatZodErrorMessage } from '../../utils/formatZodErrorMessage';

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(4),
});

export class LoginController implements IController {
  constructor(
    private readonly authenticateUser: AuthenticateUser,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const validation = loginSchema.safeParse(httpRequest.body);
    if (!validation.success) {
      return {
        statusCode: 422,
        body: { error: formatZodErrorMessage(validation.error) },
      };
    }

    const payload = validation.data;

    try {
      const acessToken = await this.authenticateUser.execute(payload);

      return {
        statusCode: 200,
        body: { token: acessToken },
      };
    } catch (err) {
      if (!(err instanceof Error)) throw err;
      return {
        statusCode: 403,
        body: { error: err.message },
      };
    }
  }
}
