import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create.user.dto'
import { UpdateUserDto } from './dto/update.user.dto'
import { Auth } from '@/common/decorator/auth.decorator'
import { Role } from '@/common/enum/role.enum'

@Auth(Role.Admin)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  usersList(@Query('current') current: number, @Query('name') name: string, @Query('email') email: string, @Query('phone') phone: string) {
    return this.usersService.usersList(+current || 1, name, email, phone)
  }

  @Get(':user')
  userDetail(@Param('user') user: number) {
    return this.usersService.userDetail(+user)
  }

  @Patch(':user/lock')
  lock(@Param('user') user: number) {
    return this.usersService.lock(+user)
  }

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto)
  }

  @Put(':user')
  updateUser(@Param('user') user: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(user, dto)
  }
}
