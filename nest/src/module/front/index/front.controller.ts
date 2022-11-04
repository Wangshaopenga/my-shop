import { Controller, Get, Query } from '@nestjs/common'
import { IndexDataDto } from './dto/index.data.dto'
import { FrontService } from './front.service'

@Controller('index')
export class FrontController {
  constructor(private readonly frontService: FrontService) {}

  @Get()
  getIndex(@Query() query: IndexDataDto) {
    return this.frontService.getIndex(query.page, query.recommend)
  }
}
