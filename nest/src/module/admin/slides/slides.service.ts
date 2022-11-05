import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateSlideDto } from './dto/create.slide.dto'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class SlidesService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }
  async getSlides(page: number = 1) {
    page = page || 1
    const row: number = this.config.get('SLIDES_PAGE_ROW')
    let data = await this.prisma.slides.findMany({
      skip: (page - 1) * +row,
      take: +row,
    })
    const total = await this.prisma.slides.count()
    const current_page = +page
    const total_page = Math.ceil(total / row)
    const links = current_page === total_page
      ? null
      : {
        previous_url: current_page === 1 ? null : `${this.config.get('URL')}/admin/slides?page=${current_page - 1}`,
        next_url: current_page + 1 > total_page ? null : `${this.config.get('URL')}/admin/slides?page=${current_page + 1}`,
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

  async slideDetail(id: number) {
    try {
      return await this.prisma.slides.findUnique({ where: { id } })
    }
    catch (error) {
      throw new BadRequestException('轮播图ID错误')
    }
  }

  async addSlide(dto: CreateSlideDto) {
    try {
      const slide = await this.prisma.slides.create({ data: dto })
      this.sortSlide(slide.id, 1)
      return {
        message: '创建成功',
      }
    }
    catch (error) {
      throw new BadRequestException()
    }
  }

  async updateSlide(id: number, dto: CreateSlideDto) {
    try {
      await this.prisma.slides.update({ where: { id }, data: { ...dto, status: dto.status || undefined } })
      return {
        message: '修改成功',
      }
    }
    catch (error) {
      console.log(error)
      throw new BadRequestException()
    }
  }

  async delSlide(id: number) {
    try {
      const slide = await this.prisma.slides.delete({ where: { id } })
      let slides = await this.prisma.slides.findMany()
      slides = slides.sort((a, b) => a.seq - b.seq)
      for (let i of slides) {
        if (i.seq >= slide.seq)
          await this.prisma.slides.update({ where: { id: i.id }, data: { seq: i.seq - 1 } })
      }
      return {
        message: '删除成功',
      }
    }
    catch (error) {
      console.log(error)
      throw new BadRequestException()
    }
  }

  async sortSlide(id: number, seq: number) {
    try {
      let slides = await this.prisma.slides.findMany()
      slides = slides.sort((a, b) => a.seq - b.seq)
      await this.prisma.slides.update({ where: { id }, data: { seq } })
      for (let i of slides) {
        if (i.id !== id && i.seq >= seq)
          await this.prisma.slides.update({ where: { id: i.id }, data: { seq: i.seq + 1 } })
      }
      return {
        message: '修改成功',
      }
    }
    catch (error) {
      throw new BadRequestException()
    }
  }
}
