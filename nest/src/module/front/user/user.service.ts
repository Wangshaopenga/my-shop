import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  profile(user: Users) {
    return user
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
    // this.prisma.users.update({
    //   where: {
    //     id: usre.id,
    //   },
    //   data: {
    //     avatar: file,
    //   },
    // })
    if (!file)
      throw new BadRequestException({ message: '头像不能为空' })
    return file
  }
}
