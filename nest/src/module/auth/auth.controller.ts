import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Auth } from './decorator/auth.decorator'
import { RegisterDto } from './dto/register.dto'
import { Role } from './role.enum'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Auth(Role.User)
  @Get()
  head() {
    return 11
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }
}
