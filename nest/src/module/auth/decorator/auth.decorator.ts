import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../guards/roles.guard'
import { Role } from '../role.enum'

export function Auth(...roles: Role[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard('jwt'), RolesGuard))
}
