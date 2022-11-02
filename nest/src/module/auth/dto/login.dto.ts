import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import { IsNotExists } from '@/common/validate/is-not-exists'

export class LoginDto {
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotExists('users', 'email', { message: '用户不存在' })
  email: string

  @Length(6, 12, { message: '密码长度应为6-12位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}
