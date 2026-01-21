"use client";
import { FormContainer } from "@/components/ui/FormContainer";
import { FormInput } from "@/components/ui/FormInput";
import { UserResetPassword, UserResetPasswordSchema } from "@/types";
import { AlertCircle, ArrowRight, CheckCircle, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ResetPasswordAction } from "./action";
import { useRouter } from "next/navigation";

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  const onSubmit = async (data: UserResetPassword) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!email) {
      setError("Email không hợp lệ hoặc thiếu trong URL");
      return;
    }
    const dataFinal = { ...data, email };

    const res = await ResetPasswordAction(dataFinal);

    if (res.success) {
      setSuccess(true);
      // ví dụ redirect sau 1.5s
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(res.mes ?? "Đặt lại mật khẩu thất bại");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đặt lại mật khẩu
          </h1>
          <p className="text-gray-600">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đặt lại mật khẩu thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Bây giờ bạn có thể đăng nhập với mật khẩu mới
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              Đăng nhập ngay
            </a>
          </div>
        ) : (
          <FormContainer<UserResetPassword>
            schema={UserResetPasswordSchema}
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              {/* Mật khẩu mới */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <FormInput
                  name="newPassword"
                  label="Mật khẩu mới"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  className="pl-10"
                />
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <FormInput
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <FormInput
                  name="code"
                  label="Mã xác nhận"
                  type="text"
                  placeholder="Nhập mã xác nhận"
                  className="pl-10"
                />
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
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đặt lại mật khẩu
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </FormContainer>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Quay lại{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
