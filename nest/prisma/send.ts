/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'
import { Random } from 'mockjs'
const prisma = new PrismaClient()

async function user() {
  await prisma.users.create({
    data: {
      email: Random.email(),
      name: Random.name(),
      password: await hash('kkxx66'),
      avatar: Random.image('40x40'),
      is_locked: Random.integer(0, 1),
    },
  })
}
async function address(id: number) {
  await prisma.address.create({
    data: {
      userId: id,
      county: '中国',
      province: '山东省',
      city: '曲阜市',
      address: '曲阜师范大学',
      name: '王少鹏',
      phone: '15866129702',
      isDefault: 1,
    },
  })
}
async function cart() {
  await prisma.cart.create({
    data: {
      goodId: Random.integer(1, 30),
      userId: Random.integer(1, 21),
    },
  })
}
async function goods() {
  await prisma.goods.create({
    data: {
      cover: Random.image('120x120'),
      description: Random.cparagraph(),
      details: Random.cparagraph(),
      pics: Random.image('120x120'),
      price: Random.float(10, 200),
      title: Random.ctitle(),
      stock: Random.integer(30, 100),
      sales: Random.integer(30, 100),
      isRecommend: Random.integer(0, 1),
      isOn: Random.integer(0, 1),
      categoryId: Random.integer(1, 13),
      userId: Random.integer(1, 30),
    },
  })
}

async function category() {
  await prisma.categories.create({
    data: {
      name: Random.ctitle(),
      pid: Random.integer(1, 3),
      level: Random.integer(0, 3),
      status: Random.integer(0, 1),
    },
  })
}

async function slides() {
  await prisma.slides.create({
    data: {
      img: Random.image('120x120'),
      title: Random.ctitle(),
      status: 1,
    },
  })
}

async function comments() {
  await prisma.comments.create({
    data: {
      goodId: Random.integer(1, 30),
      orderId: Random.integer(1, 560),
      rate: Random.integer(1, 3),
      star: Random.integer(1, 5),
      userId: Random.integer(1, 30),
      reply: Random.csentence(),
      content: Random.cparagraph(1, 10),
    },
  })
}
async function orders() {
  await prisma.orders.create({
    data: {
      amount: Random.integer(10, 150),
      orderNo: `${Random.integer(1000)}`,
      addressId: Random.integer(1, 21),
      status: Random.integer(1, 5),
      payTime: new Date(),
      payType: '支付宝',
      tradNo: `${Random.integer(1000)}`,
      expressType: 'SF',
      expressNo: `${Random.integer(1000000000, 99999999999999)}`,
      userId: Random.integer(1, 30),
    },
  })
}

async function orders_detail(id: number) {
  const order = await prisma.orders.findUnique({ where: { id } })
  await prisma.orderDetails.create({
    data: {
      num: Random.integer(1, 10),
      price: order.amount,
      goodId: Random.integer(1, 30),
      orderId: id,
    },
  })
}

async function run() {
  for (let i = 531; i < 560; i++)
    // await user()
    // await category()
    // await address(i + 1)
    // await orders()
    // await goods()
    await orders_detail(i + 1)
    // await cart()
    // await slides()
    // await comments()
  console.log('finish')
}

run()
