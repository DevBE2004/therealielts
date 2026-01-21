'use server'

import { AuthService } from '@/services/auth.service'
import { SignUp } from '@/types'

export async function registerAction(raw: SignUp): Promise<{ success: boolean; mes?: string }> {
  try {
    const res = await AuthService.signUp(raw);
    if (!res.success) {
      return { success: false, mes: res.mes || 'Đăng ký thất bại' };
    }

    return { success: true };
  } catch (err: any) {
    let message = 'Có lỗi xảy ra khi đăng ký';

    // Nếu server trả message JSON trong string (vd HTTP 500)
    if (typeof err.message === 'string') {
      try {
        const parsed = JSON.parse(err.message.split(':').slice(1).join(':').trim());
        if (parsed?.mes) message = parsed.mes;
      } catch {
      }
    }

    return { success: false, mes: message };
  }
}
