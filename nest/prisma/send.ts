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
async function address() {
  await prisma.address.create({
    data: {
      userId: 1,
      county: '中国',
      province: '山东省',
      city: '曲阜市',
      address: '曲阜师范大学',
      name: '王少鹏',
      phone: '15866129702',
    },
  })
}
async function cart() {
  await prisma.cart.create({
    data: {
      goodId: 1,
      userId: 1,
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
      userId: Random.integer(1, 1),
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

async function run() {
  for (let index = 0; index < 6; index++)
    // await user()
    // await category()
    // await goods()
    // await cart()
    // await address()
    await slides()

  console.log('finish')
}

run()
