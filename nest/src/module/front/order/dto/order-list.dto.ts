import { Type } from 'class-transformer'

export class OrderListDto {
  @Type(() => Number)
  page?: number = 1

  @Type(() => Number)
  status?: number = 1
}
