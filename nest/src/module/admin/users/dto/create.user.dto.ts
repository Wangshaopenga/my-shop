import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '昵称不能为空' })
  name: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string

  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 12, { message: '密码长度应为6-12位' })
  password: string
}
