import { Controller, Get, Param, Query } from '@nestjs/common'
import { GoodsData } from './entities/GoodsData'
import { IndexData } from './entities/IndexData'
import { FrontService } from './front.service'

@Controller()
export class FrontController {
  constructor(private readonly frontService: FrontService) {}

  @Get('index')
  getIndex(@Query() query: IndexData) {
    return this.frontService.getIndex(query.page, query.recommend)
  }

  @Get('goods')
  getGoods(@Query() query: GoodsData) {
    for (let e in query) {
      if (!query[e])
        query[e] = undefined
    }
    return this.frontService.getGoods(query.page, query.title, +query.category_id, query.recommend, query.price, query.sales)
  }

  @Get('goods/:id')
  findOne(@Param('id') id: string) {
    return this.frontService.goodsDetails(+id)
  }
}
