import { BadRequestException, Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { AddAddressDto } from './dto/add.address.dto'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) { }
  async addAddress(dto: AddAddressDto, user: Users) {
    if (dto.isDefault)
      await this.prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: 0 } })
    await this.prisma.address.create({
      data: {
        ...dto,
        userId: user.id,
      },
    })
    return {
      message: '创建成功',
    }
  }

  async getAddress(user: Users) {
    const address = await this.prisma.address.findMany({ where: { userId: user.id } })
    return address
  }

  async addressDetail(id: number, user: Users) {
    const detail = await this.prisma.address.findFirst({ where: { id, userId: user.id } })
    if (detail)
      return detail
    else
      throw new BadRequestException('地址ID错误')
  }

  async updateAddress(id: number, dto: AddAddressDto, user: Users) {
    if (dto.isDefault) {
      try {
        await this.prisma.address.updateMany({ where: { id, userId: user.id }, data: { isDefault: 0 } })
      }
      catch (error) {
        throw new BadRequestException('地址ID错误')
      }
    }
    const address = await this.prisma.address.updateMany({ where: { id, userId: user.id }, data: { ...dto } })
    if (address) {
      return {
        message: '更新成功!',
      }
    }
  }

  async delAddress(id: number, user: Users) {
    try {
      await this.prisma.address.deleteMany({ where: { id, userId: user.id } })
      return {
        message: '删除成功',
      }
    }
    catch (error) {
      throw new BadRequestException('地址ID错误')
    }
  }

  async setDefault(id: number, user: Users) {
    try {
      await this.prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: 0 } })
      await this.prisma.address.updateMany({ where: { id, userId: user.id }, data: { isDefault: 1 } })
      return {
        message: '更新成功',
      }
    }
    catch (error) {
      throw new BadRequestException('地址ID错误')
    }
  }
}
