import { Type } from 'class-transformer'

export class IndexDataDto {
  @Type(() => Number)
  page?: number

  @Type(() => Number)
  recommend?: number
}
