import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class CommentsService {
  constructor(private config: ConfigService, private prisma: PrismaService) { }
  async getComments(page: number = 1, rate: number) {
    page = page || 1
    const row: number = this.config.get('COMMENTS_PAGE_ROW')
    let data = await this.prisma.comments.findMany({
      skip: (page - 1) * +row,
      take: +row,
      where: {
        rate: +rate || undefined,
      },
    })
    const total = await this.prisma.comments.count({
      where: {
        rate: +rate || undefined,
      },
    })
    const current_page = +page
    const total_page = Math.ceil(total / row)
    const links = current_page === total_page
      ? null
      : {
        previous_url: current_page === 1 ? null : `${this.config.get('URL')}/admin/comments?page=${current_page - 1}&rate=${rate}`,
        next_url: current_page + 1 > total_page ? null : `${this.config.get('URL')}/admin/comments?page=${current_page + 1}&rate=${rate}`,
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

  async commentDetail(id: number) {
    try {
      return await this.prisma.comments.findUnique({ where: { id } })
    }
    catch (error) {
      throw new BadRequestException('评论ID错误')
    }
  }

  async reply(id: number, reply: string) {
    if (!reply)
      throw new BadRequestException('回复不能为空')
    try {
      await this.prisma.comments.update({ where: { id }, data: { reply } })
      return {
        message: '回复成功!',
      }
    }
    catch (error) {
      throw new BadRequestException()
    }
  }

  async delComment(id: number) {
    try {
      await this.prisma.comments.delete({ where: { id } })
      return {
        message: '删除成功',
      }
    }
    catch (error) {
      throw new BadRequestException()
    }
  }
}
