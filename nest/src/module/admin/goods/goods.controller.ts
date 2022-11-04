import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CreateGoodDto } from './dto/create.good.dto'
import { QueryGoodsDto } from './dto/query.goods.dto'
import { GoodsService } from './goods.service'
import { Role } from '@/common/enum/role.enum'
import { CurrentUser } from '@/common/decorator/user.decorator'
import { Auth } from '@/common/decorator/auth.decorator'

@Auth(Role.Admin)
@Controller('admin/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  getGoods(@Query() dto: QueryGoodsDto) {
    return this.goodsService.getGoods(dto)
  }

  @Post()
  addGood(@Body() dto: CreateGoodDto, @CurrentUser() user: Users) {
    return this.goodsService.addGood(dto, user)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsService.goodsDetails(+id)
  }

  @Put(':good')
  updateGood(@Param('good')good: number, @Body() dto: CreateGoodDto) {
    return this.goodsService.updateGood(+good, dto)
  }

  @Patch(':id/on')
  changeIsOn(@Param('id') id: string) {
    return this.goodsService.changeIsOn(+id)
  }

  @Patch(':id/recommend')
  changeIsRecommend(@Param('id') id: string) {
    return this.goodsService.changeIsRecommend(+id)
  }
}
