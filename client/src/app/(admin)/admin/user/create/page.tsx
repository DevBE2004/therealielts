"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import { z } from "zod";

import {
  Camera,
  Trash,
  User as UserIcon,
  Lock,
  Mail,
  Smartphone,
  WorkflowIcon,
} from "lucide-react";
import { UserCreate, UserCreateByAdminSchema, UserSchema } from "@/types";
import slugify from "slugify";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";

export default function CreateUserPage() {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserCreate>({
    resolver: zodResolver(UserCreateByAdminSchema),
    defaultValues: {
      role: "USER",
    },
  });
  console.log("EROOOSO: ", errors);
  const watchAvatar = watch("avatar");

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("avatar", file as File, { shouldValidate: true });
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setValue("avatar", undefined);
      setAvatarPreview(null);
    }
  };

  const onSubmit = async (data: UserCreate) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("password", data.password);
      formData.append("role", data.role);
      formData.append("occupation", data?.occupation || "");

      if (data.avatar) formData.append("avatar", data.avatar);

      const res = await clientHttp(z.any(), {
        path: "/user/create-user-by-admin",
        method: "POST",
        body: formData,
      });

      if (res?.success) {
        toast.success("Tạo user thành công");
        reset();
        setAvatarPreview(null);
        router.push("/admin/user");
      } else {
        alert(res?.message || "Có lỗi khi tạo user");
      }
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning(err.message.mes);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserIcon size={24} /> Tạo User mới
      </h1>

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
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="email"
                {...register("email")}
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
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
                  errors.mobile ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* Occupation */}
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
                  errors.mobile ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="password"
                {...register("password")}
                className={`mt-1 block w-full rounded-md border px-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
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
            >
              <option value="USER">USER</option>
              <option value="EDITOR">EDITOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
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
                  setAvatarPreview(null);
                  setValue("avatar", undefined);
                }}
                className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-1"
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
            {isSubmitting ? "Đang gửi..." : "Tạo User"}
          </button>
        </div>
      </form>
    </div>
  );
}
