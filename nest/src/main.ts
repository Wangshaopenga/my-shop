import { NestFactory } from '@nestjs/core'
import { TransformInterceptor } from './interceptor/transform.interceptor'
import { AppModule } from './module/app/app.module'
import ValidatePipe from './validate/validate.pipe'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidatePipe({ transform: true }))
  app.setGlobalPrefix('/api')
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(3000)
}
bootstrap()
