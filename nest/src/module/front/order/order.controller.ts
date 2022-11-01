import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'
import { OrderListDto } from './dto/order-list.dto'
import { CurrentUser } from '@/module/auth/decorator/user.decorator'
import { Auth } from '@/module/auth/decorator/auth.decorator'
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

    @Get('preview')
    @Auth()
    preview(@CurrentUser() user: Users) {
      return this.orderService.preview(user)
    }

    @Post()
    @Auth()
    createOrder(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: Users) {
      return this.orderService.createOrder(createOrderDto, user)
    }

    @Get(':order')
    @Auth()
    orderDetail(@Param('order') id: number, @CurrentUser() user: Users, @Query('include') include: string) {
      return this.orderService.orderDetail(+id, user, include)
    }

    @Get()
    @Auth()
    orderList(@Query() dto: OrderListDto, @CurrentUser() user: Users) {
      return this.orderService.orderList(dto, user)
    }

    @Patch(':id/confirm')
    @Auth()
    confirm(@Param('id') id: number) {
      return this.orderService.confirm(+id)
    }

    @Patch(':id/paytest')
    @Auth()
    pay(@Param('id') id: number, @Query('type') type: 'aliyun' | 'wechat') {
      return this.orderService.pay(+id, type)
    }
}
