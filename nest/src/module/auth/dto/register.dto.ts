import { IsEmail, IsNotEmpty, Length } from 'class-validator'
import { IsConfirmRule } from '@/validate/is-confirm.rule'
import { IsExistsRule } from '@/validate/is-not-exists'

export class RegisterDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsExistsRule('users', { message: '账号已经存在' })
  email: string

  @IsNotEmpty({ message: '密码不能为空' })
  @IsConfirmRule({ message: '两次密码不一致' })
  @Length(6, 12, { message: '密码长度应为6-12位' })
  password: string

  @Length(6, 12, { message: '密码长度应为6-12位' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  password_confirmation: string

  avatar: string
}
