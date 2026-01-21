'use client';

import {  useState } from 'react';
import { IeltsRegisterState } from '../../app/(user)/dang-ky-thi-ielts-tai-idp/actions';
import { clientHttp } from '@/lib/clientHttp';
import { ApiResponseSchema, ExamRegistrationCreateRequestSchema } from '@/types';
import {z} from "zod"

function Field({
  label,
  name,
  type = 'text',
  required,
  children,
  ...props
}: React.PropsWithChildren<{
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  [key: string]: any;
}>) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1" htmlFor={name}>
        {label}
      </label>
      {children ?? (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          className="border rounded p-2 w-full"
          {...props}
        />
      )}
    </div>
  );
}

const initialState: IeltsRegisterState = { ok: false };

export default function IeltsRegisterForm() {
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await clientHttp(ApiResponseSchema(ExamRegistrationCreateRequestSchema), {
        path: '/exam-registration/create',
        method: 'POST',
        body: formData,
      })

      if (res.success) {
        setMessage('Đăng ký thành công!')
        e.currentTarget.reset()
      } else {
        setMessage(res.message || 'Có lỗi xảy ra')
      }
    } catch (err: any) {
      console.error(err.message || 'Lỗi kết nối')
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md"
      noValidate
    >
      <h3 className="text-xl lg:text-2xl  font-sans font-[600] p-2 bg-[#324F8D] text-white text-center rounded-lg mb-4">Form đăng ký thi IELTS tại Ant Edu</h3>

      <Field label="Họ và tên" name="name" required />
      <Field label="Số điện thoại" name="mobile" type="tel" required />
      <Field label="Email" name="email" type="email" required />

      <Field label="Chọn đơn vị tổ chức" name="organization" required>
        <select name="organization" required className="border rounded p-2 w-full">
          <option value="">-- Chọn --</option>
          <option value="IDP">IDP</option>
        </select>
      </Field>

      <Field label="Chọn module thi" name="module" required>
        <select name="module" required className="border rounded p-2 w-full">
          <option value="">-- Chọn --</option>
          <option value="Academic">Academic</option>
          <option value="General">General</option>
        </select>
      </Field>

      <Field label="Chọn hình thức thi" name="form" required>
        <select name="form" required className="border rounded p-2 w-full">
          <option value="">-- Chọn --</option>
          <option value="Thi trên giấy">Thi trên giấy</option>
          <option value="Thi trên máy">Thi trên máy</option>
        </select>
      </Field>

      <Field label="Đối tượng đăng ký" name="registrationObject" required>
        <select name="registrationObject" required className="border rounded p-2 w-full">
          <option value="">-- Chọn --</option>
          <option value="Học sinh ngoài">Học sinh ngoài</option>
          <option value="Học sinh ngoài">Học viên ANT</option>
        </select>
      </Field>

      <Field label="Chọn ngày thi" name="examDate" type="date" required />
      <Field label="Số CMND/CCCD/Hộ chiếu" name="passport" required />
      <Field label="Địa chỉ nhận thư" name="mailingAddress" required />
      <Field label="Chọn sản phẩm ưu đãi" name="promotionalProduct" />

      <Field label="Upload hóa đơn (nếu có)" name="bill">
        <input
          name="bill"
          type="file"
          accept=".pdf,image/*"
          className="border rounded p-2 w-full"
        />
      </Field>

      <p className="text-gray-600 text-sm">
        Vui lòng kiểm tra kỹ thông tin trước khi gửi.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Đang gửi...' : 'Gửi đăng ký'}
      </button>

      {message && (
        <p className={`mt-2 text-sm ${message.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}