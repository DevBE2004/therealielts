import { ResetPasswordForm } from './ResetPassowordFrom'
export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4'>
      <div className='max-w-md mx-auto'>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
