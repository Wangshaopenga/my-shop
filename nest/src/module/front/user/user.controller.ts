import { Body, Controller, Get, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Users } from '@prisma/client'
import { Auth } from '../../auth/decorator/auth.decorator'
import { CurrentUser } from '../../auth/decorator/user.decorator'
import { Role } from '../../auth/role.enum'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @Auth(Role.User, Role.Admin)
  profile(@CurrentUser() user: Users) {
    return this.userService.profile(user)
  }

  @Put()
  @Auth()
  updateName(@Body('name') name: string, @CurrentUser() user: Users) {
    return this.userService.updateName(name, user)
  }

  @Post('avatar')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: Users) {
    return this.userService.uploadAvatar(user, file)
  }
}
