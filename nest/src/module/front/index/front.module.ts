import { Module } from '@nestjs/common'
import { AddressModule } from '../address/address.module'
import { CartsModule } from '../carts/carts.module'
import { GoodsModule } from '../goods/goods.module'
import { OrderModule } from '../order/order.module'
import { UserModule } from '../user/user.module'
import { FrontController } from './front.controller'
import { FrontService } from './front.service'

@Module({
  imports: [
    GoodsModule,
    UserModule,
    CartsModule,
    OrderModule,
    AddressModule,
  ],
  controllers: [FrontController],
  providers: [FrontService],
})
export class FrontModule { }
