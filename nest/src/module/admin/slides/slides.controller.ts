import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { SlidesService } from './slides.service'
import { CreateSlideDto } from './dto/create.slide.dto'
import { Auth } from '@/common'
import { Role } from '@/common/enum/role.enum'

@Auth(Role.Admin)
@Controller('admin/slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get()
  getSlides(@Query('page') page: number) {
    return this.slidesService.getSlides(page)
  }

  @Get(':slide')
  slideDetail(@Param('slide') id: number) {
    return this.slidesService.slideDetail(id)
  }

  @Post()
  addSlide(@Body() dto: CreateSlideDto) {
    return this.slidesService.addSlide(dto)
  }

  @Put(':slide')
  updateSlide(@Param('slide') id: number, @Body() dto: CreateSlideDto) {
    return this.slidesService.updateSlide(id, dto)
  }

  @Delete(':slide')
  delSlide(@Param('slide') id: number) {
    return this.slidesService.delSlide(id)
  }

  @Patch(':slide/seq')
  sortSlide(@Param('slide') id: number, @Body('seq') seq: number) {
    return this.slidesService.sortSlide(id, +seq)
  }
}
