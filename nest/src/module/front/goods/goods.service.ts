import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Categories, Goods, Users } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@Injectable()
export class GoodsService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async getGoods(page = 1, title?: string, categoryId?: number, recommend = 2, price = 2, sales = 1) {
    const categories = await this.prisma.categories.findMany()
    const tree = this.buildTree(categories)
    const row: number = this.config.get('RECOMMENDGOODS_PAGE_ROW')
    let goods = await this.prisma.goods.findMany({
      skip: (+page - 1) * +row,
      take: +row,
      where: {
        categoryId: categoryId ? +categoryId : {},
        title: {
          contains: title,
        },
      },
      orderBy: [
        { price: +price === 2 ? 'asc' : 'desc' },
        { sales: +sales === 2 ? 'asc' : 'desc' },
      ],
    })
    const total = await this.prisma.goods.count({
      where: {
        categoryId: categoryId ? +categoryId : {},
        title: {
          contains: title,
        },
      },
    })
    const total_page = total % row === 0 ? Number((total / row).toFixed(0)) : Number((total / row).toFixed(0)) + 1
    const goodsInfo = {
      current_page: page,
      total_page,
      data: await this.getGoodsDate(goods),
      from: (page - 1) * row + 1,
      to: (page - 1) * row + 1 + goods.length,
      first_page_url: `${this.config.get('URL')}/index?page=${1}&recommend=${recommend}`,
      previous_url: page === 1 ? null : `${this.config.get('URL')}/index?page=${+page + 1}&recommend=${recommend}`,
      next_page_url: page + 1 > total_page ? null : `${this.config.get('URL')}/index?page=${+page + 1}&recommend=${recommend}`,
      per_page: row,
    }
    const recommend_goods = await this.prisma.goods.findMany({
      take: 10,
      where: {
        isRecommend: 1,
      },
    })
    return { goods: goodsInfo, recommend_goods, categories: tree }
  }

  async goodsDetails(id: number) {
    const goods = await this.prisma.goods.findUnique({
      where: {
        id,
      },
    })
    const comments = await this.prisma.comments.findMany({ where: { goodId: id } })
    const commentsData = []
    for (let e of comments) {
      const user = await this.prisma.users.findUnique({
        select: {
          id: true, name: true, avatar: true,
        },
        where: { id: e.userId },
      })
      commentsData.push({ ...e, user })
    }
    const collects_count = await this.prisma.cart.count({
      where: {
        goodId: id,
      },
    })
    return { goods, collects_count, comments: commentsData }
  }

  async comments(dto: CreateCommentDto, user: Users) {
    const orders = await this.prisma.orders.findMany({ where: { userId: user.id } })
    const isPay = orders.every(async (e) => {
      const order = await this.prisma.orderDetails.findFirst({ where: { orderId: e.id } })
      return order.goodId === dto.goodId
    })
    if (!isPay)
      throw new BadRequestException({ message: '商品未购买,不能参与评论' })
    const isComment = await this.prisma.comments.findFirst({ where: { goodId: dto.goodId, orderId: dto.orderId } })
    if (isComment)
      throw new BadRequestException({ message: '已参与评论,不能重复评论' })

    await this.prisma.comments.create({
      data: { ...dto, userId: user.id },
    })
    return { message: '评论成功!' }
  }

  buildTree(list: Categories[]) {
    let temp = {}
    let tree = {}
    for (let i in list)
      temp[list[i].id] = list[i]

    for (let i in temp) {
      if (temp[i].pid) {
        if (!temp[temp[i].pid].children)
          temp[temp[i].pid].children = []

        temp[temp[i].pid].children.push(temp[i])
      }
      else {
        tree[temp[i].id] = temp[i]
      }
    }

    return tree
  }

  async getGoodsDate(list: Goods[]) {
    let data = []
    for (let e of list) {
      const comments_count = await this.prisma.comments.count({
        where: {
          goodId: e.id,
        },
      })
      const collects_count = await this.prisma.cart.count({
        where: {
          goodId: e.id,
        },
      })
      data.push({
        id: e.id,
        title: e.title,
        price: e.price,
        sales: e.sales,
        cover: e.cover,
        cover_url: e.cover,
        updated_at: e.updatedAt,
        comments_count,
        collects_count,
      })
    }
    return data
  }
}
