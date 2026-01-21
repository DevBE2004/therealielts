// app/(auth)/register/RegisterForm.tsx
"use client";
import { FormContainer } from "@/components/ui/FormContainer";
import { FormInput } from "@/components/ui/FormInput";
import { SignUp, SignUpSchema } from "@/types";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerAction } from "./actions";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignUp) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await registerAction(data);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(res.mes ?? "Đăng ký thất bại");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-b old text-gray-800 mb-4">
            Đăng ký thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn sẽ được chuyển hướng đến trang đăng nhập
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tạo tài khoản
          </h1>
          <p className="text-gray-600">
            Điền thông tin để bắt đầu sử dụng dịch vụ
          </p>
        </div>

        <FormContainer<SignUp> schema={SignUpSchema} onSubmit={onSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-30" />
              <FormInput
                name="name"
                label="Họ và tên"
                placeholder="Nhập họ và tên đầy đủ"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-30" />
              <FormInput
                name="mobile"
                label="Số điện thoại"
                type="tel"
                placeholder="Nhập số điện thoại"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-30" />
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="Nhập địa chỉ email"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-30" />
              <FormInput
                name="password"
                label="Mật khẩu"
                type="password"
                placeholder="Tạo mật khẩu an toàn"
                className="pl-10"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  Đăng ký
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </FormContainer>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
