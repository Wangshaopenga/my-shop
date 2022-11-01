import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Users } from '@prisma/client'
import * as dayjs from 'dayjs'
import { Random } from 'mockjs'
import AliPaySdk from 'alipay-sdk'
import AliPayForm from 'alipay-sdk/lib/form'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderListDto } from './dto/order-list.dto'
import { PrismaService } from '@/module/prisma/prisma.service'
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

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

  async pay(id: number, type: 'aliyun' | 'wechat') {
    if (type !== 'aliyun' && type !== 'wechat')
      throw new BadRequestException('支付类型错误')
    const orderDetail = await this.prisma.orderDetails.findFirst({ where: { orderId: id } })
    const good = await this.prisma.goods.findUnique({ where: { id: orderDetail.goodId } })
    const alipaySdk = new AliPaySdk({
      appId: this.config.get('APPID'), // appid
      gateway: 'https://openapi.alipaydev.com/gateway.do', // 支付宝沙箱测试网关
      privateKey: this.config.get('PRIVATEKEY'), // 应用私钥
      alipayPublicKey: this.config.get('ALIPAYPUBLICKEY'), // 支付宝公钥：
    })
    const orderInfo = {
      outTradeNo: `D${dayjs().format('YYYYMMDDHHmmssSSS')}${Random.integer(100, 999)}`, // 订单号
      totalAmount: orderDetail.price * orderDetail.num, // 金额
      subject: `在少鹏商城购买${good.title} 等${orderDetail.num}商品`, // 内容
    }
    const formData = new AliPayForm()
    formData.setMethod('get')
    formData.addField('bizContent', {
      productCode: 'FAST_INSTANT_TRADE_PAY', // 产品码
      ...orderInfo,
    })
    // // 执行结果
    const reult = await alipaySdk.exec('alipay.trade.page.pay', {}, { formData })
    return { link: reult }
  }
}
