import { clientHttp } from '@/lib/clientHttp'
import { AuthResponseSchema, SignIn, SignUp } from '@/types'

export const AuthService = {
  // Đăng nhập
  signIn: (data: SignIn) =>
    clientHttp(AuthResponseSchema, {
      path: '/user/sign-in',
        method: 'POST',
        body: data,
    }),

  // Đăng ký
  signUp: (data: SignUp) =>
    clientHttp(AuthResponseSchema, {
      path: '/user/sign-up',
        method: 'POST',
        body: data,
    }),

  // Đăng xuất
  signOut: () =>
    clientHttp(AuthResponseSchema, {
      path: '/user/sign-out',
      method: 'GET',
    }),
}
