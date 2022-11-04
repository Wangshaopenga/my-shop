import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderService } from './order.service'
import { OrderListDto } from './dto/order-list.dto'
import { CurrentUser } from '@/common/decorator/user.decorator'
import { Auth } from '@/common/decorator/auth.decorator'

@Auth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('preview')
  preview(@CurrentUser() user: Users) {
    return this.orderService.preview(user)
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: Users) {
    return this.orderService.createOrder(createOrderDto, user)
  }

  @Get(':order')
  orderDetail(@Param('order') id: number, @CurrentUser() user: Users, @Query('include') include: string) {
    return this.orderService.orderDetail(+id, user, include)
  }

  @Get()
  orderList(@Query() dto: OrderListDto, @CurrentUser() user: Users) {
    return this.orderService.orderList(dto, user)
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: number) {
    return this.orderService.confirm(+id)
  }

  @Patch(':id/paytest')
  payTest(@Param('id') id: number, @Query('type') type: 'aliyun' | 'wechat') {
    return this.orderService.paytest(+id, type)
  }

  @Get(':id/pay')
  pay(@Param('id') id: number, @Query('type') type: 'aliyun' | 'wechat') {
    return this.orderService.pay(+id, type)
  }

  @Get(':id/status')
  payStatus(@Param('id') id: number) {
    return this.orderService.payStatus(+id)
  }

  @Post(':id/return')
  returnPay(@Param('id') id: number) {
    return this.orderService.returnPay(+id)
  }
}
