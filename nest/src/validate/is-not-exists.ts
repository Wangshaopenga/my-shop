// eslint-disable-next-line import/named
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator'
import { PrismaClient } from '@prisma/client'
// 表字段是否唯一
export function IsNotExists(table: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsNotExists',
      target: object.constructor,
      propertyName,
      constraints: [table],
      options: validationOptions,
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const prisma = new PrismaClient()
          const res = await prisma[table].findFirst({
            where: {
              id: value,
            },
          })
          return res
        },
      },
    })
  }
}
