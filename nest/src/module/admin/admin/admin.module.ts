import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { CategoryModule } from '../category/category.module'
import { GoodsModule } from '../goods/goods.module'
import { CommentsModule } from '../comments/comments.module'
import { OrdersModule } from '../orders/orders.module'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'

@Module({
  imports: [UsersModule, CategoryModule, GoodsModule, CommentsModule, OrdersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
