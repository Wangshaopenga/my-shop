import { Controller, Get, Query } from '@nestjs/common'
import { IndexData } from './entities'
import { FrontService } from './front.service'

@Controller('index')
export class FrontController {
  constructor(private readonly frontService: FrontService) {}

  @Get()
  getIndex(@Query() query: IndexData) {
    return this.frontService.getIndex(query.page, query.recommend)
  }
}
