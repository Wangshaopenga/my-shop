import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateFrontDto } from './dto/create-front.dto'
import { UpdateFrontDto } from './dto/update-front.dto'
import { IndexData } from './entities/IndexData'

@Injectable()
export class FrontService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async findAll(page = 1, recommend = 1) {
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
      to: page * row,
      first_page_url: `${this.config.get('URL')}/index?page=${1}&recommend=${recommend}`,
      next_page_url: `${this.config.get('URL')}/index?page=${+page + 1}&recommend=${recommend}`,
      per_page: row,

    }
    return { categories: tree, goods: goodsInfo, slides }
  }

  findOne(id: number) {
    return `This action returns a #${id} front`
  }

  buildTree(list: any) {
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
}
