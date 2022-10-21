import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import { IsConfirm } from '@/validate/is-confirm'
import { IsExists } from '@/validate/is-exists'

export class RegisterDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string

  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsExists('users', { message: '账号已经存在' })
  email: string

  @Length(6, 12, { message: '密码长度应为6-12位' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsConfirm({ message: '两次密码不一致' })
  password: string

  @Length(6, 12, { message: '密码长度应为6-12位' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  password_confirmation: string

  avatar: string
}
