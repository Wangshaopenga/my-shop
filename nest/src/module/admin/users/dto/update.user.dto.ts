import { IsEmail, IsNotEmpty } from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty({ message: '昵称不能为空' })
  name: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string
}
