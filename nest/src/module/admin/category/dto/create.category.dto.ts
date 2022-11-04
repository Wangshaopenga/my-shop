import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateCategoryDto {
  @IsNotEmpty({ message: '分类名称 不能为空' })
  name: string

  @Type(() => Number)
  pid: number = 0

  group: string
}
