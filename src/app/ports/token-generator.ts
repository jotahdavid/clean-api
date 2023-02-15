export interface ITokenGenerator {
  generate(payload: string | object): Promise<string | undefined>;
}
