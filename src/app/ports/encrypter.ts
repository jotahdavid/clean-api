export interface IEncrypter {
  make(value: string): Promise<string>;
  compare(value: string, hashedValue: string): Promise<boolean>;
}
