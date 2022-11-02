import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class AddAddressDto {
  @IsNotEmpty({ message: '收货人姓名不能为空' })
  name: string

  @IsNotEmpty({ message: '详细地址不能为空' })
  address: string

  @IsNotEmpty({ message: '收货手机不能为空' })
  phone: string

  @IsNotEmpty({ message: '省份不能为空' })
  province: string

  @IsNotEmpty({ message: '城市不能为空' })
  city: string

  @IsNotEmpty({ message: '区县不能为空' })
  county: string

  @Type(() => Number)
  isDefault?: number = 0
}
