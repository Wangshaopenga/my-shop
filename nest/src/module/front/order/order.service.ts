import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Users } from '@prisma/client'
import * as dayjs from 'dayjs'
import { Random } from 'mockjs'
import AliPayForm from 'alipay-sdk/lib/form'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderListDto } from './dto/order-list.dto'
import { PrismaService } from '@/module/prisma/prisma.service'
import { alipaySdk } from '@/common'
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private config: ConfigService, private http: HttpService) { }

  async preview(user: Users) {
    const address = await this.prisma.address.findMany({ where: { userId: user.id } })
    const cart = await this.prisma.cart.findMany({ where: { userId: user.id } })
    let carts = []
    for (let e of cart) {
      const good = await this.prisma.goods.findUnique({
        select: {
          id: true,
          title: true,
          cover: true,
        },
        where: { id: e.goodId },
      })
      carts.push({
        ...e,
        goods: {
          ...good,
          cover_url: `${this.config.get('STATIC_BASE_URL')}/${good.cover}`,
        },
      })
    }

    return { address, carts }
  }

  async createOrder(dto: CreateOrderDto, user: Users) {
    const address = await this.prisma.address.findFirst({ where: { id: dto.addressId, userId: user.id } })
    if (!address)
      throw new BadRequestException('地址ID不正确,请输入正确地址ID!')
    const good = await this.prisma.goods.findUnique({ where: { id: dto.goodId } })
    if (good.stock <= 0 || good.stock - dto.number < 0)
      throw new BadRequestException('商品库存不足')
    const order = await this.prisma.orders.create({
      data: {
        amount: dto.number ? good.price * (+dto.number) : good.price,
        userId: user.id,
        addressId: dto.addressId,
        orderNo: `${dayjs().format('YYYYMMDDHHmmssSSS')}${Random.integer(100, 999)}`,
        status: 1,
      },
    })
    const orderDetail = await this.prisma.orderDetails.create({
      data: {
        num: +dto.number || 1,
        price: good.price,
        goodId: good.id,
        orderId: order.id,
      },
    })
    await this.prisma.goods.update({
      where: { id: good.id },
      data: { stock: good.stock - 1 },
    })
    return { order, orderDetail }
  }

  async orderDetail(id: number, user: Users, include: string) {
    const order = await this.prisma.orders.findUnique({ where: { id } })
    if (!order)
      throw new BadRequestException('订单不存在!')
    if (include) {
      const includes: { good?: any; user?: any; address?: any; orderDetail?: any } = {}
      const orderDetail = await this.prisma.orderDetails.findFirst({ where: { orderId: order.id } })
      if (include.includes('goods')) {
        const good = await this.prisma.goods.findUnique({ where: { id: orderDetail.goodId } })
        includes.good = good
      }
      if (include.includes('user'))
        includes.user = user
      if (include.includes('address')) {
        const address = await this.prisma.address.findUnique({ where: { id: order.addressId } })
        includes.address = address
      }
      if (include.includes('orderDetails')) {
        const orderDetail = await this.prisma.orderDetails.findFirst({ where: { orderId: order.id } })
        includes.orderDetail = orderDetail
      }
      return { ...order, includes }
    }
    else {
      return order
    }
  }

  async orderList(dto: OrderListDto, user: Users) {
    const row = this.config.get('ORDER_PAGE_ROW')
    const data = await this.prisma.orders.findMany({
      where: {
        userId: user.id,
        status: dto.status,
      },
      skip: (dto.page - 1) * row,
      take: +row,
    })
    const total = await this.prisma.orders.count({ where: { userId: user.id, status: dto.status } })
    const current_page = dto.page
    const total_page = Number((total / row).toFixed(0)) + 1
    const links = current_page === total_page
      ? null
      : {
        next: current_page === 1 ? null : `${this.config.get('URL')}/orders?page=${current_page - 1}`,
        previous: current_page + 1 > total_page ? null : `${this.config.get('URL')}/orders?page=${current_page + 1}`,
      }
    const pagination = {
      total,
      count: data.length,
      per_page: row,
      current_page,
      total_page,
      links,
    }
    return { data, meta: { pagination } }
  }

  async confirm(id: number) {
    const order = await this.prisma.orders.update({ where: { id }, data: { status: 4 } })
    if (order)
      return { message: '收货成功!' }
  }

  async paytest(id: number, type: 'aliyun' | 'wechat') {
    if (type !== 'aliyun' && type !== 'wechat')
      throw new BadRequestException('支付类型错误')
    const orderDetail = await this.prisma.orderDetails.findFirst({ where: { orderId: id } })
    const good = await this.prisma.goods.findUnique({ where: { id: orderDetail.goodId } })
    const info = {
      outTradeNo: `D${dayjs().format('YYYYMMDDHHmmssSSS')}${Random.integer(100, 999)}`, // 订单号
      totalAmount: orderDetail.price * orderDetail.num, // 金额
      subject: `在少鹏商城购买${good.title} 等${orderDetail.num}商品`, // 内容
    }
    return info
  }

  async pay(id: number, type: 'aliyun' | 'wechat') {
    if (type !== 'aliyun' && type !== 'wechat')
      throw new BadRequestException('支付类型错误')
    const orderInfo = await this.paytest(id, type)
    const formData = new AliPayForm()
    formData.setMethod('get')
    formData.addField('bizContent', {
      productCode: 'FACE_TO_FACE_PAYMENT', // 产品码
      ...orderInfo,
    })
    // // 执行结果
    const result = await alipaySdk.exec('alipay.trade.precreate', {}, { formData })
    const response$ = this.http.get(result as string)
    const res = await lastValueFrom(response$)
    const payInfo = res.data.alipay_trade_precreate_response
    // return payInfo
    if (payInfo.code === '10000') { // 接口调用成功
      await this.prisma.orders.update({
        where: { id },
        data: {
          tradNo: orderInfo.outTradeNo,
          payType: type,
          payTime: (new Date()),
        },
      })
      return {
        code: payInfo.code,
        msg: payInfo.msg,
        out_trade_no: orderInfo.outTradeNo,
        qr_ode: payInfo.qr_code,
        ar_code_url: `https://api.nbhao.org/v1/qrcode/make?text=${payInfo.qr_code}`,
      }
    }
    else if (payInfo.code === '40004') {
      throw new BadRequestException(`${payInfo.sub_msg}`)
    }
  }

  async payStatus(id: number) {
    const order = await this.prisma.orders.findUnique({ where: { id } })
    const formData = new AliPayForm()
    formData.setMethod('get')
    formData.addField('bizContent', {
      out_trade_no: order.tradNo,
    })
    const result = await alipaySdk.exec('alipay.trade.query', {}, { formData })
    const response$ = this.http.get(result as string)
    const res = await lastValueFrom(response$)
    const data = res.data.alipay_trade_query_response
    if (data.code === '10000') {
      switch (data.trade_status) {
        case 'WAIT_BUYER_PAY':
          return 1
        case 'TRADE_SUCCESS':
          await this.prisma.orders.update({ where: { id }, data: { status: 2 } })
          return 2
        default:
          break
      }
    }
    else if (data.code === '40004') {
      throw new BadRequestException(data.sub_msg)
    }
  }

  async returnPay(id: number) {
    const order = await this.prisma.orders.findUnique({ where: { id } })
    const formData = new AliPayForm()
    formData.setMethod('get')
    formData.addField('bizContent', {
      out_trade_no: order.tradNo,
      refund_amount: order.amount,
    })
    const result = await alipaySdk.exec('alipay.trade.refund', {}, { formData })
    const response$ = this.http.get(result as string)
    const res = await lastValueFrom(response$)
    const data = res.data.alipay_trade_refund_response
    if (data.code === '10000')
      await this.prisma.orders.update({ where: { id }, data: { status: 6 } })
    else
      throw new BadRequestException(data.sub_msg)
  }
}
