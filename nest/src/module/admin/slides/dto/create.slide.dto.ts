import { Transform, Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateSlideDto {
  @IsNotEmpty({ message: '标题不能为空' })
  title: string

  @IsNotEmpty({ message: '图片地址不能为空' })
  img: string

  @Transform(({ value }) => value || null)
  url?: string

  @Type(() => Number)
  status?: number
}
