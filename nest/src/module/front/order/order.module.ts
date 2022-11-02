import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  imports: [HttpModule.registerAsync({
    useFactory: () => ({
      headers: {
        // 'content-type': 'image/png',
        // 'transfer-encoding': 'chunked',
        // 'connection': 'close',
        // 'x-frame-options': 'SAMEORIGIN',
        // 'content-disposition': 'filename="qrcode.png"',
      },
    }),
  })],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
