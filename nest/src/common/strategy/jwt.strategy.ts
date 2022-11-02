import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/module/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService) {
    super({
      // 解析用户提交的Bearer Token header数据
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 加密码的 secret
      secretOrKey: configService.get('TOKEN_SECRET'),
    })
  }

  // 验证通过后结果用户资料
  async validate({ sub }) {
    const res = await this.prisma.users.findUnique({
      where: { id: sub },
    })
    delete res.password
    return res
  }
}
