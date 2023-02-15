import { Router } from 'express';

import { ExpressRouteAdapter } from '../app/adapters/express-route-adapter';
import { makeCreateUserController } from '../app/factories/create-user-controller';

const userRoutes = Router();

userRoutes.post('/users', ExpressRouteAdapter.adapt(makeCreateUserController()));

export { userRoutes };
