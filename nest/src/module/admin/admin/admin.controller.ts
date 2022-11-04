import { Controller, Get } from '@nestjs/common'
import { AdminService } from './admin.service'
import { Auth } from '@/common'
import { Role } from '@/common/enum/role.enum'

@Auth(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('index')
  index() {
    return this.adminService.index()
  }
}
