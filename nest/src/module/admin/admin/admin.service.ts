import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async index() {
    const user_count = await this.prisma.users.count()
    const goods_count = await this.prisma.goods.count()
    const order_count = await this.prisma.orders.count()
    const goods_info = {
      on_num: await this.prisma.goods.count({ where: { isOn: 1 } }),
      un_num: await this.prisma.goods.count({ where: { isOn: 0 } }),
      stock_null: await this.prisma.goods.count({ where: { stock: 0 } }),
      recommend_null: await this.prisma.goods.count({ where: { isRecommend: 1 } }),
    }
    return { user_count, goods_count, order_count, goods_info }
  }
}
