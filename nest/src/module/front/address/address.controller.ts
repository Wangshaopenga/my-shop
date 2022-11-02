import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { Users } from '@prisma/client'
import { AddressService } from './address.service'
import { AddAddressDto } from './dto/add.address.dto'
import { Auth } from '@/module/auth/decorator/auth.decorator'
import { CurrentUser } from '@/module/auth/decorator/user.decorator'

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  @Auth()
  addAddress(@Body() dto: AddAddressDto, @CurrentUser() user: Users) {
    return this.addressService.addAddress(dto, user)
  }

  @Get()
  @Auth()
  getAddress(@CurrentUser() user: Users) {
    return this.addressService.getAddress(user)
  }

  @Get(':id')
  @Auth()
  addressDetail(@Param('id') id: number, @CurrentUser() user: Users) {
    return this.addressService.addressDetail(+id, user)
  }

  @Put(':id')
  @Auth()
  updateAddress(@Param('id') id: number, @Body() dto: AddAddressDto, @CurrentUser() user: Users) {
    return this.addressService.updateAddress(+id, dto, user)
  }

  @Delete(':id')
  @Auth()
  delAddress(@Param('id') id: number, @CurrentUser() user: Users) {
    return this.addressService.delAddress(+id, user)
  }

  @Patch(':id/default')
  @Auth()
  setDefault(@Param('id') id: number, @CurrentUser() user: Users) {
    return this.addressService.setDefault(+id, user)
  }
}
