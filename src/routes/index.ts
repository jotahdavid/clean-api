import { Router } from 'express';

import { userRoutes } from './users-routes';
import { loginRoute } from './login-route';

const routes = Router();

routes.use(userRoutes);
routes.use(loginRoute);

export default routes;
