import { BadRequestException, Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { AddCartDto } from './dto/add-cart.dto'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) { }
  async addCart(user: Users, addCartDto: AddCartDto) {
    const isExist = await this.prisma.cart.findFirst({ where: { goodId: +addCartDto.goodId, userId: user.id } })
    if (isExist) {
      await this.prisma.cart.update({
        where: {
          id: isExist.id,
        },
        data: {
          num: isExist.num + 1,
        },
      })
    }
    else {
      await this.prisma.cart.create({
        data: {
          goodId: +addCartDto.goodId,
          num: +addCartDto.num || 1,
          userId: user.id,
        },
      })
    }
    return { message: '添加成功!' }
  }

  async getCart(user: Users) {
    const carts = await this.prisma.cart.findMany({
      where: {
        userId: user.id,
      },
    })
    return carts
  }

  async changeNum(num = 1, id: number) {
    const cart = await this.prisma.cart.findUnique({ where: { id } })
    if (!cart)
      throw new BadRequestException({ message: '购物车中不存在此商品!' })
    await this.prisma.cart.update({ where: { id }, data: { num: num + cart.num } })
    return { message: '更新成功!' }
  }

  async delNum(id: number) {
    await this.prisma.cart.delete({ where: { id } })
    return { message: '删除成功!' }
  }

  async changeChecked(ids: number[], user: Users) {
    if (ids.length === 0)
      throw new BadRequestException('购物车ID 不能为空')
    const carts = await this.prisma.cart.findMany({ where: { userId: user.id } })
    carts.forEach(async (e) => {
      if (ids.includes(e.id))
        await this.prisma.cart.update({ where: { id: e.id }, data: { isChecked: 1 } })
      else
        await this.prisma.cart.update({ where: { id: e.id }, data: { isChecked: 0 } })
    })
    return { message: '更新成功!' }
  }
}
