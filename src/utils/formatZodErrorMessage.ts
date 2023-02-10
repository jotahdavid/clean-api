import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export function formatZodErrorMessage(error: ZodError) {
  return fromZodError(error, { maxIssuesInMessage: 1, prefix: '', prefixSeparator: '' }).message;
}
