import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create.user.dto'
import { UpdateUserDto } from './dto/update.user.dto'
import { Auth } from '@/module/auth/decorator/auth.decorator'
import { Role } from '@/module/auth/role.enum'

@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @Auth(Role.Admin)
  usersList(@Query('current') current: number, @Query('name') name: string, @Query('email') email: string, @Query('phone') phone: string) {
    return this.usersService.usersList(+current || 1, name, email, phone)
  }

  @Get(':user')
  @Auth(Role.Admin)
  userDetail(@Param('user') user: number) {
    return this.usersService.userDetail(+user)
  }

  @Patch(':user/lock')
  @Auth(Role.Admin)
  lock(@Param('user') user: number) {
    return this.usersService.lock(+user)
  }

  @Post()
  @Auth(Role.Admin)
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto)
  }

  @Put(':user')
  @Auth(Role.Admin)
  updateUser(@Param('user') user: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(user, dto)
  }
}
