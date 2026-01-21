import { ForgotPasswordForm } from './ForgotFrom'
export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4'>
      <div className='max-w-md mx-auto'>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
