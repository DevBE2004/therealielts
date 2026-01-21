import { UserService } from '@/services/user.service'
import { UserForgotPassword } from '@/types'

export async function ForgotPasswordAction(raw: UserForgotPassword) {
  const res = await UserService.forgotPassword(raw)
  return res
}
