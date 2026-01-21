import { RegisterForm } from './RegisterForm'
export const dynamic = "force-dynamic";

export default function Register() {
  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4'>
      <div className='max-w-md mx-auto'>
        <RegisterForm />
      </div>
    </div>
  )
}
