import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { ExpressDto } from './dto/express.dto'
import { OrdersService } from './orders.service'
import { Role } from '@/common/enum/role.enum'
import { Auth } from '@/common'

@Auth(Role.Admin)
@Controller('admin/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  getOrders(@Query('page') page: number, @Query('orderNo') orderNo: string, @Query('tradeNo') tradeNo: string, @Query('status') status: number) {
    return this.ordersService.getOrders(page, orderNo, tradeNo, status)
  }

  @Get(':order')
  orderDetail(@Param('order') id: number) {
    return this.ordersService.orderDetail(id)
  }

  @Patch(':order/post')
  express(@Param('order') id: number, @Body() dto: ExpressDto) {
    return this.ordersService.express(id, dto)
  }
}
