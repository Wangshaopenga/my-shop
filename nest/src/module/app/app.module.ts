import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AdminModule } from '../admin/admin/admin.module'
import { AuthModule } from '../auth/auth.module'
import { FrontModule } from '../front/index/front.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    FrontModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
