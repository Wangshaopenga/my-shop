import { extname } from 'path'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { UploadController } from './upload.controller'

@Module({
  imports: [MulterModule.registerAsync({
    useFactory() {
      return {
        storage: diskStorage({
          destination: 'uploads',
          filename: (req, file, callback) => {
            const path = `${Date.now()}${extname(file.originalname)}`
            callback(null, path)
          },
        }),
      }
    },
  })],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
