import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { Users } from '@prisma/client'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { Role } from '../auth/role.enum'
import { CreateCommentDto } from './dto/create-comment.dto'
import { GoodsData } from './entities/GoodsData'
import { GoodsService } from './goods.service'

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  getGoods(@Query() query: GoodsData) {
    for (let e in query) {
      if (!query[e])
        query[e] = undefined
    }
    return this.goodsService.getGoods(query.page, query.title, +query.category_id, query.recommend, query.price, query.sales)
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.goodsService.goodsDetails(+id)
  }

  @Post('/comment')
  @Auth(Role.User, Role.Admin)
  comment(@Body() dto: CreateCommentDto, @CurrentUser() user: Users) {
    return this.goodsService.comments(dto, user)
  }
}
