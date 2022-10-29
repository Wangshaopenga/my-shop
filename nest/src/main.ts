import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TransformInterceptor } from './interceptor/transform.interceptor'
import { AppModule } from './module/app/app.module'
import ValidatePipe from './validate/validate.pipe'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets('uploads', { prefix: '/uploads' })
  app.useGlobalPipes(new ValidatePipe({ transform: true }))
  app.setGlobalPrefix('/api')
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(3000)
}
bootstrap()
