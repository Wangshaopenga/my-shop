import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Users } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UpdateDto } from './dto/updata.dto'

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
      info: res,
      token: (await this.token(res)).token,
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: loginDto.email,
      },
    })
    delete user.password
    return {
      info: user,
      ...(await this.token(user)),
    }
  }

  async update(updateDto: UpdateDto, user: Users) {
    const res = await this.prisma.users.findUnique({
      where: {
        id: user.id,
      },
    })
    console.log(res)
    const isConfirm = await verify(res.password, updateDto.old_password)
    if (!isConfirm)
      throw new BadRequestException('两次密码不一致')
    const isModi = await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: await hash(updateDto.password),
      },
    })
    if (isModi) {
      return {
        success: '修改成功!',
      }
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

