import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CreateCommentDto } from './dto/create-comment.dto'
import { QueryGoodsDto } from './dto/query.goods.dto'
import { GoodsService } from './goods.service'
import { Auth } from '@/common/decorator/auth.decorator'
import { CurrentUser } from '@/common/decorator/user.decorator'
import { Role } from '@/common/enum/role.enum'

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  getGoods(@Query() query: QueryGoodsDto) {
    for (let e in query) {
      if (!query[e])
        query[e] = undefined
    }
    return this.goodsService.getGoods(query.page, query.title, +query.category_id, query.recommend, query.price, query.sales)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsService.goodsDetails(+id)
  }

  @Post('comment')
  @Auth(Role.User, Role.Admin)
  comment(@Body() dto: CreateCommentDto, @CurrentUser() user: Users) {
    return this.goodsService.comments(dto, user)
  }
}
