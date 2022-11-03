import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Categories, Goods } from '@prisma/client'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class FrontService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async getIndex(page = 1, recommend = 1) {
    const row: number = this.config.get('RECOMMENDGOODS_PAGE_ROW')
    const slides = await this.prisma.slides.findMany()
    const categories = await this.prisma.categories.findMany()
    const goods = await this.prisma.goods.findMany({
      skip: (page - 1) * row,
      take: +row,
    })
    const tree = this.buildTree(categories)
    const goodsInfo = {
      current_page: page,
      data: goods,
      from: (page - 1) * row + 1,
      to: (page - 1) * row + 1 + goods.length,
      first_page_url: `${this.config.get('URL')}/index?page=${1}&recommend=${recommend}`,
      next_page_url: `${this.config.get('URL')}/index?page=${+page + 1}&recommend=${recommend}`,
      per_page: row,

    }
    return { categories: tree, goods: goodsInfo, slides }
  }

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
    const goodsInfo = {
      current_page: page,
      data: await this.getGoodsDate(goods),
      from: (page - 1) * row + 1,
      to: (page - 1) * row + 1 + goods.length,
      first_page_url: `${this.config.get('URL')}/index?page=${1}&recommend=${recommend}`,
      next_page_url: `${this.config.get('URL')}/index?page=${+page + 1}&recommend=${recommend}`,
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
