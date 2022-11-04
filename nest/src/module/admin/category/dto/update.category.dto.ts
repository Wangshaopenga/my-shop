import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class UpdateCategory {
  @IsNotEmpty({ message: '分类昵称不能为空' })
  name: string

  @Type(() => Number)
  pid?: number
}
