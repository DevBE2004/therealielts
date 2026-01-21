// app/(auth)/register/RegisterForm.tsx
"use client";
import { FormContainer } from "@/components/ui/FormContainer";
import { FormInput } from "@/components/ui/FormInput";
import { UserService } from "@/services/user.service";
import { setCurrent, setLogin } from "@/store/userSlice";
import { SignIn, SignInSchema } from "@/types";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { SignInAction } from "./action";

export function SignInForm() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignIn) => {
    setLoading(true);
    setError(null);
    const res = await SignInAction(data);

    if (res.success) {
      const userRes = await UserService.getCurrent();
      if (userRes.success) {
        const currentUser = userRes.user;
        dispatch(setLogin({ isLogin: true }));
        dispatch(setCurrent({ current: currentUser }));
        router.push(currentUser?.role === "USER" ? "/" : "/admin");
      } else {
        setError(userRes.mes ?? "Người dùng chưa được đăng ký");
      }
    } else {
      setError(res.mes ?? "Đăng nhập thất bại");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
          <p className="text-gray-600">
            Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục
          </p>
        </div>

        <FormContainer<SignIn> schema={SignInSchema} onSubmit={onSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="Nhập địa chỉ email"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <FormInput
                name="password"
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu"
                className="pl-10"
              />
            </div>

            {/* Thêm dòng Forgot Password */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
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
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </FormContainer>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
