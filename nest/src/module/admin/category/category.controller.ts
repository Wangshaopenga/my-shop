import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create.category.dto'
import { UpdateCategory } from './dto/update.category.dto'
import { Auth } from '@/common/decorator/auth.decorator'
import { Role } from '@/common/enum/role.enum'

@Auth(Role.Admin)
@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategory(@Query('type') type: string) {
    return this.categoryService.getCategory(type)
  }

  @Get(':category')
  categoryDetail(@Param('category') category: number) {
    return this.categoryService.categoryDetail(+category)
  }

  @Patch(':category/status')
  categoryStatus(@Param('category') category: number) {
    return this.categoryService.categoryStatus(+category)
  }

  @Post()
  addCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.addCategory(dto)
  }

  @Put(':category')
  updetaCategory(@Param('category') category: number, @Body() dto: UpdateCategory) {
    return this.categoryService.updateCategory(+category, dto)
  }
}
