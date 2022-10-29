import { Controller, Get, Query } from '@nestjs/common'
import { IndexData } from './entities'
import { IndexService } from './index.service'

@Controller('index')
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get()
  getIndex(@Query() query: IndexData) {
    return this.indexService.getIndex(query.page, query.recommend)
  }
}
