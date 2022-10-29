import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { GoodsModule } from '../front/goods/goods.module'
import { IndexModule } from '../front/index/index.module'
import { UserModule } from '../front/user/user.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    IndexModule,
    GoodsModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
