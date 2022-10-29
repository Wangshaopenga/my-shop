import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '../role.enum'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (requiredRoles.length === 0)
      return true
    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.includes(user.role)
  }
}
