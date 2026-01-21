"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import { z } from "zod";

import {
  Camera,
  Trash,
  User as UserIcon,
  Mail,
  Smartphone,
  Lock,
  Underline,
  WorkflowIcon,
} from "lucide-react";
import {
  UserSchema,
  ApiResponseSchema,
  User,
  UserUpdate,
  UserUpdateByAdminSchema,
} from "@/types";
import slugify from "slugify";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";

export default function UpdateUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const showSessionExpired = useSessionExpiredDialog();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdate>({
    resolver: zodResolver(UserUpdateByAdminSchema),
    defaultValues: { role: "USER" },
  });

  const watchAvatar = watch("avatar");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await clientHttp(ApiResponseSchema(UserSchema), {
          path: `/user/${id}`,
          method: "GET",
        });

        if (res.user) {
          setUser(res.user);
          reset({
            name: res.user.name,
            email: res.user.email,
            mobile: res.user.mobile,
            occupation: res.user.occupation,
            role: res.user.role,
            code: res.user.code,
          });
          if (res.user.avatar) setAvatarPreview(res.user.avatar || undefined);
        }
      } catch {
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, reset]);

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Không thể tải hình ảnh");
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Hình ảnh không được vượt quá 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một tệp hình ảnh");
      return;
    }
    setValue("avatar", file, { shouldValidate: true });
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: UserUpdate) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("occupation", data?.occupation || "");
      formData.append("role", data.role);
      if (data.password) {
        formData.append("password", data.password);
      }
      if (data.avatar) {
        formData.append("avatar", data.avatar);
      } else if (user?.avatar) {
        const oldFile = await urlToFile(user.avatar, "old-avatar.jpg");
        formData.append("avatar", oldFile);
      }
      if (data.code) formData.append("code", data.code);

      await clientHttp(ApiResponseSchema(UserSchema), {
        path: `/user/update-user-by-admin/${id}`,
        method: "PUT",
        body: formData,
      });

      toast.success("Cập nhật user thành công");
      router.push("/admin/user");
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning("Email hoặc số điện thoại đã tồn tại");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserIcon size={24} /> Cập nhật User
      </h1>

      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên *
              </label>
              <input
                type="text"
                {...register("name")}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-400" : "border-gray-200"
                }`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
                <input
                  type="email"
                  {...register("email")}
                  className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-400" : "border-gray-200"
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại *
              </label>
              <div className="relative">
                <Smartphone
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
                <input
                  type="tel"
                  {...register("mobile")}
                  className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mobile?.message
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Công việc hiện tại
              </label>
              <div className="relative">
                <WorkflowIcon
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  {...register("occupation")}
                  className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mobile?.message
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                {...register("role")}
                className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                disabled={isSubmitting}
              >
                <option value="USER">USER</option>
                <option value="EDITOR">EDITOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code (tùy chọn)
              </label>
              <input
                type="text"
                {...register("code")}
                className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                placeholder="Nhập code (nếu có)"
                disabled={isSubmitting}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu mới (tùy chọn)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="password"
                {...register("password", {
                  validate: (value) => value || "Vui lòng nhập password",
                })}
                className="mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                placeholder="Vui lòng nhập mật khẩu"
                disabled={isSubmitting}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-sm text-center px-2 flex flex-col items-center justify-center">
                  <Camera size={24} className="mb-1" /> Chưa có avatar
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Ảnh đại diện (tuỳ chọn)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="mt-1 block w-full text-sm text-gray-600"
                disabled={isSubmitting}
              />
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.avatar as any)?.message}
                </p>
              )}

              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarPreview(undefined);
                    setValue("avatar", undefined);
                  }}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-1"
                  disabled={isSubmitting}
                >
                  <Trash size={14} /> Xóa ảnh
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-md font-semibold text-white transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật User"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
