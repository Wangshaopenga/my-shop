import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Users } from '@prisma/client'
import { hash } from 'argon2'
import { CreateUserDto } from './dto/create.user.dto'
import { UpdateUserDto } from './dto/update.user.dto'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }
  async usersList(page = 1, name?: string, email?: string, phone?: string) {
    const row: number = this.config.get('USERS_PAGE_ROW')
    let data = await this.prisma.users.findMany({
      skip: (+page - 1) * +row,
      take: +row,
      where: {
        name: {
          contains: name || undefined,
        },
        email: {
          contains: email || undefined,
        },
        phone: {
          contains: phone || undefined,
        },
      },
    })
    const total = await this.prisma.users.count({
      where: {
        name: {
          contains: name || undefined,
        },
        email: {
          contains: email || undefined,
        },
        phone: {
          contains: phone || undefined,
        },
      },
    })
    const current_page = page
    const total_page = total % row === 0 ? Number((total / row).toFixed(0)) : Number((total / row).toFixed(0)) + 1
    const links = current_page === total_page
      ? null
      : {
        previous_url: current_page === 1 ? null : `${this.config.get('URL')}/orders?page=${current_page - 1}`,
        next_url: current_page + 1 > total_page ? null : `${this.config.get('URL')}/orders?page=${current_page + 1}`,
      }
    const pagination = {
      total,
      count: data.length,
      per_page: row,
      current_page,
      total_page,
      links,
    }
    const usersData = this.getUsersData(data)
    return { data: usersData, meta: { pagination } }
  }

  getUsersData(list: Users[]) {
    let data = []
    for (let e of list) {
      data.push({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        avatar: e.avatar,
        avatar_url: e.avatar ? `${this.config.get('STATIC_BASE_URL')}/${e.avatar}` : null,
        isLocked: e.is_locked,
        updated_at: e.updatedAt,
      })
    }
    return data
  }

  async userDetail(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } })
    delete user.password
    return user
  }

  async lock(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } })
    await this.prisma.users.update({ where: { id }, data: { is_locked: user.is_locked ? 0 : 1 } })
    return {
      message: '更新成功!',
    }
  }

  async createUser(dto: CreateUserDto) {
    await this.prisma.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      },
    })
    return { message: '创建成功' }
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    await this.prisma.users.update({ where: { id }, data: { ...dto } })
    return { message: '更新成功!' }
  }
}
