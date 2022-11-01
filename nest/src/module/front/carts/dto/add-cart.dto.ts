import { IsNotEmpty } from 'class-validator'

export class AddCartDto {
  @IsNotEmpty({ message: '商品ID 不能为空' })
  goodId: number

  num?: number
}
