import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Users } from '@prisma/client'
import { CreateGoodDto } from './dto/create.good.dto'
import { QueryGoodsDto } from './dto/query.goods.dto'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class GoodsService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async getGoods(dto: QueryGoodsDto) {
    dto.page = dto.page || 1
    const row: number = this.config.get('GOODS_PAGE_ROW')
    let data = await this.prisma.goods.findMany({
      skip: (+dto.page - 1) * +row,
      take: +row,
      where: {
        title: {
          contains: dto.title || undefined,
        },
        categoryId: +dto.categoryId || undefined,
        isOn: dto.isOn === '' ? undefined : +dto.isOn,
        isRecommend: dto.isRecommend === '' ? undefined : +dto.isRecommend,
      },
    })
    const total = await this.prisma.goods.count({
      where: {
        title: {
          contains: dto.title || undefined,
        },
        categoryId: +dto.categoryId || undefined,
        isOn: dto.isOn === '' ? undefined : +dto.isOn,
        isRecommend: dto.isRecommend === '' ? undefined : +dto.isRecommend,
      },
    })
    const current_page = +dto.page
    const total_page = total % row === 0 ? Number((total / row).toFixed(0)) : Number((total / row).toFixed(0)) + 1
    const links = current_page === total_page
      ? null
      : {
        previous_url: current_page === 1 ? null : `${this.config.get('URL')}/orders?page=${current_page - 1}`,
        next_url: current_page + 1 > total_page ? null : `${this.config.get('URL')}/orders?page=${current_page + 1}`,
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

  async addGood(dto: CreateGoodDto, user: Users) {
    const category = await this.prisma.categories.findUnique({ where: { id: dto.categoryId } })
    if (!category)
      throw new BadRequestException('分类不存在')
    if (category.level === 1)
      throw new BadRequestException('只能向二级分类添加商品')
    if (category.status === 0)
      throw new BadRequestException('分类被禁用')
    try {
      await this.prisma.goods.create({
        data: {
          ...dto,
          userId: user.id,
        },
      })
    }
    catch (error) {
      console.log(error)
    }
    return {
      message: '添加成功!',
    }
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

  async updateGood(id: number, dto: CreateGoodDto) {
    const category = await this.prisma.categories.findUnique({ where: { id: dto.categoryId } })
    if (!category)
      throw new BadRequestException('分类不存在')
    if (category.level === 1)
      throw new BadRequestException('只能向二级分类添加商品')
    if (category.status === 0)
      throw new BadRequestException('分类被禁用')
    try {
      await this.prisma.goods.update({
        where: { id },
        data: {
          ...dto,
        },
      })
      return {
        message: '修改成功!',
      }
    }
    catch (error) {
      if (error.response)
        throw new BadRequestException(error.response)
      throw new BadRequestException('商品不存在')
    }
  }

  async changeIsOn(id: number) {
    try {
      const good = await this.prisma.goods.findUnique({ where: { id } })
      await this.prisma.goods.update({ where: { id }, data: { isOn: good.isOn ? 0 : 1 } })
      return {
        message: '修改成功!',
      }
    }
    catch (error) {
      if (error.response)
        throw new BadRequestException(error.response)
      throw new BadRequestException()
    }
  }

  async changeIsRecommend(id: number) {
    try {
      const good = await this.prisma.goods.findUnique({ where: { id } })
      await this.prisma.goods.update({ where: { id }, data: { isRecommend: good.isRecommend ? 0 : 1 } })
      return {
        message: '修改成功!',
      }
    }
    catch (error) {
      if (error.response)
        throw new BadRequestException(error.response)
      throw new BadRequestException()
    }
  }
}
