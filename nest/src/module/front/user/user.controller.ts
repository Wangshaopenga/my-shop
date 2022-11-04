import { Body, Controller, Get, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Users } from '@prisma/client'
import { UserService } from './user.service'
import { Auth } from '@/common/decorator/auth.decorator'
import { CurrentUser } from '@/common/decorator/user.decorator'

@Auth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  profile(@CurrentUser() user: Users) {
    return this.userService.profile(user)
  }

  @Put()
  updateName(@Body('name') name: string, @CurrentUser() user: Users) {
    return this.userService.updateName(name, user)
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: Users) {
    return this.userService.uploadAvatar(user, file)
  }
}
