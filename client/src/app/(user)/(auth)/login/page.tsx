import { SignInForm } from './SignInForm'

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4'>
      <div className='max-w-md mx-auto'>
        <SignInForm />
      </div>
    </div>
  )
}
