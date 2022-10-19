// eslint-disable-next-line import/named
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator'
import { PrismaClient } from '@prisma/client'
// 表字段是否唯一
export function IsExistsRule(table: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsExistsRule',
      target: object.constructor,
      propertyName,
      constraints: [table],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const prisma = new PrismaClient()
          const res = await prisma[table].findFirst({
            where: {
              [args.property]: value,
            },
          })
          return !res
        },
      },
    })
  }
}
