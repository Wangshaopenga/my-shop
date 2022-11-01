import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateOrderDto {
  @Type(() => Number)
  @IsNotEmpty({ message: '收货地址不能为空!' })
  addressId: number

  @Type(() => Number)
  @IsNotEmpty({ message: '购买商品不能为空!' })
  goodId: number

  number = 1
}
