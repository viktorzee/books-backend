import { ValidationError } from 'class-validator';

export default function getFriendlyValidationErrorMessage(
  errors: ValidationError[],
): string {
  // We always want to show the user the first error message
  const err = errors[0];
  const errMessages = Object.keys(err.constraints).map(
    (key) => err.constraints[key],
  );
  return errMessages[0];
}
