import { BadRequestException, Injectable } from '@nestjs/common'
import { Categories } from '@prisma/client'
import { CreateCategoryDto } from './dto/create.category.dto'
import { UpdateCategory } from './dto/update.category.dto'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }
  async getCategory(type: string) {
    const category = await this.prisma.categories.findMany({
      where: {
        status: type === 'all' ? undefined : 0,
      },
    })
    const tree = this.buildTree(category)
    return tree
  }

  async categoryDetail(id: number) {
    try {
      const data = await this.prisma.categories.findUnique({ where: { id } })
      return data
    }
    catch (error) {
      throw new BadRequestException('分类ID错误!')
    }
  }

  async categoryStatus(id: number) {
    try {
      const data = await this.prisma.categories.findUnique({ where: { id } })
      await this.prisma.categories.update({ where: { id }, data: { status: data.status === 0 ? 1 : 0 } })
      return {
        message: '修改成功!',
      }
    }
    catch (error) {
      throw new BadRequestException('分类ID错误!')
    }
  }

  async addCategory(dto: CreateCategoryDto) {
    if (dto.pid === 0) {
      await this.prisma.categories.create({
        data: {
          status: 0,
          level: 1,
          ...dto,
          group: dto.group || null,
        },
      })
      return {
        message: '添加成功',
      }
    }
    const p = await this.prisma.categories.findFirst({ where: { id: dto.pid } })
    if (!p)
      throw new BadRequestException('父级分类ID错误!')
    if (p.level !== 1)
      throw new BadRequestException('不能超过二级分类!')
    await this.prisma.categories.create({
      data: {
        ...dto,
        status: 0,
        level: 2,
        group: dto.group || null,
      },
    })
    return { message: '添加成功' }
  }

  async updateCategory(id: number, dto: UpdateCategory) {
    try {
      const data = await this.prisma.categories.findFirst({ where: { id } })
      if (data.pid === 0 && dto.pid !== 0) {
        const children = await this.prisma.categories.count({ where: { pid: id } })
        if (children !== 0)
          throw new BadRequestException('该分类还有子分类,不能设置为二级分类')
      }
      console.log(1)
      await this.prisma.categories.update({
        where: { id },
        data: {
          ...dto,
        },
      })
      return { message: '修改成功' }
    }
    catch (error) {
      if (error.response)
        throw new BadRequestException(error.response.message)

      throw new BadRequestException('父级分类ID错误!')
    }
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
}
