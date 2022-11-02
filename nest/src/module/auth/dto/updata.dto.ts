import { IsNotEmpty, Length } from 'class-validator'
import { IsConfirm } from '@/common/validate/is-confirm'

export class UpdateDto {
  @Length(6, 12, { message: '密码长度应为6-12位' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  old_password: string

  @Length(6, 12, { message: '密码长度应为6-12位' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @IsConfirm({ message: '两次密码不一致' })
  password: string

  @Length(6, 12, { message: '密码长度应为6-12位' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  password_confirmation: string
}
