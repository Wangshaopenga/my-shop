import { Type } from 'class-transformer'

export class GoodsData {
  @Type(() => Number)
  page?: number

  title?: string
  @Type(() => Number)
  category_id?: number

  @Type(() => Number)
  sales?: number

  @Type(() => Number)
  recommend?: number

  @Type(() => Number)
  price?: number
}
