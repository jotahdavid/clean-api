export interface ITokenGenerator {
  readonly secret: string;
  generate(payload: string | object): Promise<string | undefined>;
}
