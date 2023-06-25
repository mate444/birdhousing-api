import { ValidationOptions, ValidationArguments, registerDecorator } from 'class-validator';
import { isValid, getAlpha2Code } from 'i18n-iso-countries';

export function IsCountry (validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: 'isCountry',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate (value: any, args: ValidationArguments) {
          return typeof value === 'string' && isValid(getAlpha2Code(value, "en"));
        }
      }
    });
  };
}
