import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExpressDto } from './dto/express.dto'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }
  async getOrders(page: number = 1, orderNo: string, tradeNo: string, status: number) {
    page = page || 1
    const row: number = this.config.get('ORDERS_PAGE_ROW')
    let data = await this.prisma.orders.findMany({
      skip: (page - 1) * +row,
      take: +row,
      where: {
        orderNo: orderNo || undefined,
        tradNo: tradeNo || undefined,
        status: status || undefined,
      },
    })
    const total = await this.prisma.orders.count({
      where: {
        orderNo: orderNo || undefined,
        tradNo: tradeNo || undefined,
        status: status || undefined,
      },
    })
    const current_page = +page
    const total_page = Math.ceil(total / row)
    const links = current_page === total_page
      ? null
      : {
        previous_url: current_page === 1 ? null : `${this.config.get('URL')}/admin/orders?page=${current_page - 1}&tradeNo=${tradeNo}&orderNo=${orderNo}&status=${status}`,
        next_url: current_page + 1 > total_page ? null : `${this.config.get('URL')}/admin/orders?page=${current_page + 1}&tradeNo=${tradeNo}&orderNo=${orderNo}&status=${status}`,
      }
    const pagination = {
      total,
      count: data.length,
      per_page: row,
      current_page,
      total_page,
      links,
    }
    return { data, meta: { pagination } }
  }

  async orderDetail(id: number) {
    try {
      return await this.prisma.orders.findUnique({ where: { id } })
    }
    catch (error) {
      throw new BadRequestException('订单不存在!')
    }
  }

  async express(id: number, dto: ExpressDto) {
    try {
      await this.prisma.orders.update({
        where: { id },
        data: { ...dto },
      })
      return {
        message: '发货成功!',
      }
    }
    catch (error) {
      if (error.response)
        throw new BadRequestException(error.response)
      throw new BadRequestException()
    }
    return { id, dto }
  }
}
