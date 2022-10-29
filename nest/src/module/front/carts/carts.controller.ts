import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CartsService } from './carts.service'
import { AddCartDto } from './dto/AddCart.dto'
import { CurrentUser } from '@/module/auth/decorator/user.decorator'
import { Auth } from '@/module/auth/decorator/auth.decorator'

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @Auth()
  addCart(@Body() addCartDto: AddCartDto, @CurrentUser() user: Users) {
    return this.cartsService.addCart(user, addCartDto)
  }

  @Get()
  @Auth()
  getCart(@CurrentUser() user: Users) {
    return this.cartsService.getCart(user)
  }

  @Put(':id')
  @Auth()
  changeNum(@Body('num') num: number, @Param('id') id: number) {
    return this.cartsService.changeNum(+num, +id)
  }

  @Delete(':id')
  @Auth()
  delNum(@Param('id') id: number) {
    return this.cartsService.delNum(+id)
  }

  @Patch('checked')
  @Auth()
  changeChecked(@Body('cart_ids') ids: number[], @CurrentUser() user: Users) {
    return this.cartsService.changeChecked(ids, user)
  }
}
