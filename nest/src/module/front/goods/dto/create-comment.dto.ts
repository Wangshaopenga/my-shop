import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { IsNotExists } from '@/validate/is-not-exists'

export class CreateCommentDto {
  @Type(() => Number)
  @IsNotEmpty({ message: '商品id不能为空' })
  @IsNotExists('goods', 'id', { message: '商品不存在' })
  goodId: number

  @Type(() => Number)
  @IsNotEmpty({ message: '订单id不能为空' })
  orderId: number

  @IsNotEmpty({ message: '评论内容不能为空' })
  content: string

  @Type(() => Number)
  rate?: number

  @Type(() => Number)
  star?: number
}
