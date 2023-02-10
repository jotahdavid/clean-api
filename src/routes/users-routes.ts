import { Router } from 'express';

import { ExpressRouteAdapter } from '../app/adapters/express-route-adapter';
import { CreateUserRouterComposer } from '../app/composers/create-user-router-composer';

const userRoutes = Router();

userRoutes.post('/users', ExpressRouteAdapter.adapt(CreateUserRouterComposer.compose()));

export { userRoutes };
