import z from 'zod';

export function isEmail(value: string) {
  return z.string().email().safeParse(value).success;
}
