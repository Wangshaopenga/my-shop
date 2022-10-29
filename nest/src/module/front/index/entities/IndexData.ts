import { Type } from 'class-transformer'

export class IndexData {
  @Type(() => Number)
  page?: number

  @Type(() => Number)
  recommend?: number
}
