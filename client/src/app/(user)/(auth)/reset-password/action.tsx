'use server'

import { UserService } from '@/services/user.service'
import { UserResetPassword } from '@/types'

export async function ResetPasswordAction(
  data: UserResetPassword & { email: string }
): Promise<{ success: boolean; mes?: string }> {
  try {
    const { email, newPassword, confirmPassword, code } = data

    const res = await UserService.resetPassword({
      email,
      code,
      newPassword,
      confirmPassword,
    })

    // Nếu server trả success=false
    if (!res.success) {
      return { success: false, mes: res.mes || 'Đặt lại mật khẩu thất bại' }
    }

    // success=true
    return { success: true }
  } catch (err: any) {
    let message = 'Có lỗi xảy ra khi đặt lại mật khẩu'

    // Nếu server trả lỗi dạng JSON trong string (vd HTTP 500)
    if (typeof err.message === 'string') {
      try {
        const parsed = JSON.parse(err.message.split(':').slice(1).join(':').trim())
        if (parsed?.mes) message = parsed.mes
      } catch {
        // giữ message mặc định
      }
    }

    return { success: false, mes: message }
  }
}
