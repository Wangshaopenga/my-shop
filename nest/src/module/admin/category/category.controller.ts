import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create.category.dto'
import { UpdateCategory } from './dto/update.category.dto'
import { Auth } from '@/module/auth/decorator/auth.decorator'
import { Role } from '@/module/auth/role.enum'

@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Auth(Role.Admin)
  getCategory(@Query('type') type: string) {
    return this.categoryService.getCategory(type)
  }

  @Get(':category')
  @Auth(Role.Admin)
  categoryDetail(@Param('category') category: number) {
    return this.categoryService.categoryDetail(+category)
  }

  @Patch(':category/status')
  @Auth(Role.Admin)
  categoryStatus(@Param('category') category: number) {
    return this.categoryService.categoryStatus(+category)
  }

  @Post()
  @Auth(Role.Admin)
  addCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.addCategory(dto)
  }

  @Put(':category')
  @Auth(Role.Admin)
  updetaCategory(@Param('category') category: number, @Body() dto: UpdateCategory) {
    return this.categoryService.updateCategory(+category, dto)
  }
}
