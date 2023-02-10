import { HttpRequest, HttpResponse } from '../shared/http';

export interface IController {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
