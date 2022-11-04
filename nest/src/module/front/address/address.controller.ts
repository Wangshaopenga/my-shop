import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { Users } from '@prisma/client'
import { AddressService } from './address.service'
import { AddAddressDto } from './dto/add.address.dto'
import { Auth } from '@/common/decorator/auth.decorator'
import { CurrentUser } from '@/common/decorator/user.decorator'

@Auth()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  addAddress(@Body() dto: AddAddressDto, @CurrentUser() user: Users) {
    return this.addressService.addAddress(dto, user)
  }

  @Get()
  getAddress(@CurrentUser() user: Users) {
    return this.addressService.getAddress(user)
  }

  @Get(':id')
  addressDetail(@Param('id') id: number, @CurrentUser() user: Users) {
    return this.addressService.addressDetail(+id, user)
  }

  @Put(':id')
  updateAddress(@Param('id') id: number, @Body() dto: AddAddressDto, @CurrentUser() user: Users) {
    return this.addressService.updateAddress(+id, dto, user)
  }

  @Delete(':id')
  delAddress(@Param('id') id: number, @CurrentUser() user: Users) {
    return this.addressService.delAddress(+id, user)
  }

  @Patch(':id/default')
  setDefault(@Param('id') id: number, @CurrentUser() user: Users) {
    return this.addressService.setDefault(+id, user)
  }
}
