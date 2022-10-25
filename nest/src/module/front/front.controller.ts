import { Controller, Get, Param, Query } from '@nestjs/common'
import { IndexData } from './entities/IndexData'
import { FrontService } from './front.service'

@Controller()
export class FrontController {
  constructor(private readonly frontService: FrontService) {}

  @Get('index')
  findAll(@Query() query: IndexData) {
    return this.frontService.findAll(query.page, query.recommend)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frontService.findOne(+id)
  }
}
