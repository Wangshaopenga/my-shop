import { extname } from 'path'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory() {
        return {
          storage: diskStorage({
            destination: 'uploads',
            filename: (req, file, callback) => {
              console.log(file)
              const path = `${Date.now()}${extname(file.originalname)}`
              callback(null, path)
            },
          }),
        }
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
