import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Users } from '@prisma/client'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorator/user.decorator'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UpdateDto } from './dto/updata.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  update(@Body() updateDto: UpdateDto, @CurrentUser() user: Users) {
    return this.authService.update(updateDto, user)
  }
}
