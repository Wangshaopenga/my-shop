import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CartsService } from './carts.service'
import { AddCartDto } from './dto/add-cart.dto'
import { CurrentUser } from '@/common/decorator/user.decorator'
import { Auth } from '@/common/decorator/auth.decorator'

@Auth()
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  addCart(@Body() addCartDto: AddCartDto, @CurrentUser() user: Users) {
    return this.cartsService.addCart(user, addCartDto)
  }

  @Get()
  getCart(@CurrentUser() user: Users) {
    return this.cartsService.getCart(user)
  }

  @Put(':id')
  changeNum(@Body('num') num: number, @Param('id') id: number) {
    return this.cartsService.changeNum(+num, +id)
  }

  @Delete(':id')
  delNum(@Param('id') id: number) {
    return this.cartsService.delNum(+id)
  }

  @Patch('checked')
  changeChecked(@Body('cart_ids') ids: number[], @CurrentUser() user: Users) {
    return this.cartsService.changeChecked(ids, user)
  }
}
