import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) { }
  async register(registerDto: RegisterDto) {
    const res = await this.prisma.users.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: await hash(registerDto.password),
        avatar: registerDto.avatar,
      },
    })
    delete res.password
    return {
      ...res,
      token: (await this.token(res)).token,
    }
  }

  async token({ id, name }) {
    return {
      token: await this.jwt.signAsync({
        name,
        sub: id,
      }),
    }
  }
}
