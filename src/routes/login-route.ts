import { Router } from 'express';

import { ExpressRouteAdapter } from '../app/adapters/express-route-adapter';
import { LoginRouterComposer } from '../app/composers/login-router-compose';

const loginRoute = Router();

loginRoute.post('/login', ExpressRouteAdapter.adapt(LoginRouterComposer.compose()));

export { loginRoute };
