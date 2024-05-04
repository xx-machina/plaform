import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import dayjs from 'dayjs';

export function IsDayjs(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDayjs',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return dayjs.isDayjs(value);
        }
      }
    });
  };
}
