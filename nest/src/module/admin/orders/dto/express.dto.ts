import { IsNotEmpty } from 'class-validator'

export class ExpressDto {
  @IsNotEmpty({ message: '快递类型不能为空' })
  expressType: string

  @IsNotEmpty({ message: '快递单号不能为空' })
  expressNo: string
}
