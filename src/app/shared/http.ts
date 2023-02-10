export interface HttpRequest {
  body: any;
}

export interface HttpResponse {
  statusCode: number;
  body: any;
}

export interface HttpRequestHandler {
  handle: (httpRequest: HttpRequest) => HttpResponse | Promise<HttpResponse>;
}
