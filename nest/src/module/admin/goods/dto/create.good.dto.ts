import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateGoodDto {
  @Type(() => Number)
  @IsNotEmpty({ message: '分类ID不能为空' })
  categoryId: number

  @IsNotEmpty({ message: '商品名称不能为空' })
  title: string

  @IsNotEmpty({ message: '商品描述不能为空' })
  description: string

  @Type(() => Number)
  @IsNotEmpty({ message: '商品价格不能为空' })
  price: number

  @Type(() => Number)
  @IsNotEmpty({ message: '商品库存不能为空' })
  stock: number

  cover: string

  @IsNotEmpty({ message: '商品详情图不能为空' })
  details: string
}
