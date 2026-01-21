'use client'
import { FormContainer } from '@/components/ui/FormContainer'
import { FormInput } from '@/components/ui/FormInput'
import { UserForgotPassword, UserForgotPasswordSchema } from '@/types'
import { AlertCircle, ArrowRight, CheckCircle, Mail } from 'lucide-react'
import { useState } from 'react'
import { ForgotPasswordAction } from './action'

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailForgotPassword, setEmailForgotPassword] = useState<string>('')

  const onSubmit = async (data: UserForgotPassword) => {
    setLoading(true)
    setError(null)
    try {
      const res = await ForgotPasswordAction(data)
      if (res.success) {
        setSuccess(true)
        setEmailForgotPassword(data.email)
      } else {
        setError(res.message ?? 'Yêu cầu khôi phục mật khẩu thất bại')
      }
    } catch (err) {
      console.log(err)
      setError('Có lỗi xảy ra khi gửi yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4'>
      <div className='bg-white p-8 rounded-2xl shadow-xl w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
            <Mail className='w-8 h-8 text-blue-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Quên mật khẩu</h1>
          <p className='text-gray-600'>Nhập email để nhận liên kết khôi phục mật khẩu</p>
        </div>

        {success ? (
          <div className='text-center py-8'>
            <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>Yêu cầu thành công!</h2>
            <p className='text-gray-600 mb-6'>
              Chúng tôi đã gửi liên kết khôi phục mật khẩu đến email của bạn. Vui lòng kiểm tra hộp
              thư đến và làm theo hướng dẫn.
            </p>
            <a
              href={`/reset-password?email=${emailForgotPassword}`}
              className='inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200'
            >
              Đi đến lấy lại mật khẩu
            </a>
          </div>
        ) : (
          <FormContainer<UserForgotPassword> schema={UserForgotPasswordSchema} onSubmit={onSubmit}>
            <div className='space-y-4'>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10' />
                <FormInput
                  name='email'
                  label='Email'
                  type='email'
                  placeholder='Nhập địa chỉ email'
                  className='pl-10'
                />
              </div>

              {error && (
                <div className='bg-red-50 text-red-700 p-3 rounded-lg flex items-start'>
                  <AlertCircle className='h-5 w-5 mr-2 mt-0.5 flex-shrink-0' />
                  <span className='text-sm'>{error}</span>
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Gửi yêu cầu
                    <ArrowRight className='ml-2 w-5 h-5' />
                  </>
                )}
              </button>
            </div>
          </FormContainer>
        )}

        <div className='mt-6 text-center'>
          <p className='text-gray-600 text-sm'>
            Quay lại{' '}
            <a
              href='/signin'
              className='text-blue-600 hover:text-blue-800 font-medium transition-colors'
            >
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
