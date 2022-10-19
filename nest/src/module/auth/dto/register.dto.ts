import { IsEmail, IsNotEmpty } from 'class-validator'
import { IsNotExistsRule } from '@/validate/is-not-exists'

export class RegisterDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({ message: '邮箱格式不正确' })
  // @IsNotExistsRule('email', { message: '用户已经存在' })
  email: string

  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  @IsNotEmpty({ message: '确认密码不能为空' })
  password_confirmation: string

  avatar: string
}
