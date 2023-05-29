import { BadRequestException } from '@nestjs/common/exceptions';
import { validate } from 'class-validator';
import  getFriendlyValidationErrorMessage from './getFriendlyValidationErrorMessage';

export default async function validateObjectHelper<T>(
  data: T,
  ctor: new () => T,
  skipMissingProperties?: boolean,
): Promise<void> {
  const instance = new ctor();
  Object.assign(instance, data);
  const errors = await validate(instance as any, {
    skipMissingProperties,
  });
  if (errors.length > 0) {
    throw new BadRequestException(getFriendlyValidationErrorMessage(errors));
  }
}
