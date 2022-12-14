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
    const total_page = Math.ceil(total / row)
    const links = current_page === total_page
      ? null
      : {
        previous_url: current_page === 1 ? null : `${this.config.get('URL')}/admin/goods?page=${current_page - 1}&title=${dto.title}&categoryId=${dto.categoryId}&isOn=${dto.isOn}&isRecommend=${dto.isRecommend}`,
        next_url: current_page + 1 > total_page ? null : `${this.config.get('URL')}/admin/goods?page=${current_page + 1}&title=${dto.title}&categoryId=${dto.categoryId}&isOn=${dto.isOn}&isRecommend=${dto.isRecommend}`,
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
      throw new BadRequestException('???????????????')
    if (category.level === 1)
      throw new BadRequestException('?????????????????????????????????')
    if (category.status === 0)
      throw new BadRequestException('???????????????')
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
      message: '????????????!',
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
      throw new BadRequestException('???????????????')
    if (category.level === 1)
      throw new BadRequestException('?????????????????????????????????')
    if (category.status === 0)
      throw new BadRequestException('???????????????')
    try {
      await this.prisma.goods.update({
        where: { id },
        data: {
          ...dto,
        },
      })
      return {
        message: '????????????!',
      }
    }
    catch (error) {
      if (error.response)
        throw new BadRequestException(error.response)
      throw new BadRequestException('???????????????')
    }
  }

  async changeIsOn(id: number) {
    try {
      const good = await this.prisma.goods.findUnique({ where: { id } })
      await this.prisma.goods.update({ where: { id }, data: { isOn: good.isOn ? 0 : 1 } })
      return {
        message: '????????????!',
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
        message: '????????????!',
      }
    }
    catch (error) {
      if (error.response)
        throw new BadRequestException(error.response)
      throw new BadRequestException()
    }
  }
}
