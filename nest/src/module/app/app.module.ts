import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { FrontController } from '../front/front.controller'
import { FrontService } from '../front/front.service'
import { GoodsController } from '../front/goods.comtroller'
import { GoodsService } from '../front/goods.service'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
  ],
  controllers: [FrontController, GoodsController],
  providers: [FrontService, GoodsService],
})
export class AppModule { }
