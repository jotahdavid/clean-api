export interface HttpRequest {
  body: any;
}

export interface HttpResponse {
  statusCode: number;
  body: any;
}

export type HttpRequestHandler = (httpRequest: HttpRequest) => HttpResponse | Promise<HttpResponse>;
