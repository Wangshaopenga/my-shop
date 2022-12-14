// eslint-disable-next-line import/named
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator'

// 表字段是否唯一
export function IsConfirm(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsConfirm',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          return Boolean(value === args.object[`${args.property}_confirmation`])
        },
      },
    })
  }
}
