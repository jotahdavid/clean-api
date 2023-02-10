import { Request, Response } from 'express';

import { HttpRequest, HttpRequestHandler } from '../shared/http';

export class ExpressRouteAdapter {
  static adapt(requestHandler: HttpRequestHandler) {
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body,
      };

      try {
        const httpResponse = await requestHandler.handle(httpRequest);
        return res.status(httpResponse.statusCode).json(httpResponse.body);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.sendStatus(500);
      }
    };
  }
}
