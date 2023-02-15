import { Router } from 'express';

import { ExpressRouteAdapter } from '../app/adapters/express-route-adapter';
import { makeLoginController } from '../app/factories/login-controller';

const loginRoute = Router();

loginRoute.post('/login', ExpressRouteAdapter.adapt(makeLoginController()));

export { loginRoute };
