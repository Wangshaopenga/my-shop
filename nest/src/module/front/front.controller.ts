import { Controller, Get, Query } from '@nestjs/common'
import { IndexData } from './entities/IndexData'
import { FrontService } from './front.service'

@Controller()
export class FrontController {
  constructor(private readonly frontService: FrontService) {}

  @Get('index')
  getIndex(@Query() query: IndexData) {
    return this.frontService.getIndex(query.page, query.recommend)
  }
}
