import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Users } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async profile(user: Users) {
    const infos = await this.prisma.users.findUnique({ where: { id: user.id } })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = infos
    return { ...info, avatar_url: `${this.config.get('STATIC_BASE_URL')}/${info.avatar}` }
  }

  async updateName(name: string, info: Users) {
    if (name === '' || name === undefined)
      throw new BadRequestException({ message: '名称不能为空', statusCode: HttpStatus.BAD_REQUEST })
    if (name === info.name)
      throw new BadRequestException({ message: '名称相同', statusCode: HttpStatus.BAD_REQUEST })
    const isSuccess = await this.prisma.users.update({ where: { id: info.id }, data: { name } })
    return { message: isSuccess ? '更新成功!' : '更新失败,请重新!' }
  }

  async uploadAvatar(usre: Users, file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException({ message: '头像不能为空' })
    const user = await this.prisma.users.update({
      where: {
        id: usre.id,
      },
      data: {
        avatar: file.filename,
      },
    })
    // return { message: '更新成功!' }
    return user
  }
}
