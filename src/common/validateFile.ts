import { ValidationOptions, ValidationArguments, registerDecorator } from 'class-validator';

interface IsFileOptions {
  mime: ('image/jpg' | 'image/png' | 'image/jpeg')[];
}

export function isFile (options: IsFileOptions, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate (value: any, args: ValidationArguments) {
          if (value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)) {
            return true;
          }
          return false;
        }
      }
    });
  };
}
