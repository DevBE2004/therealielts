"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import slugify from "slugify";
import { ApiResponseSchema, ImageSchema } from "@/types";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";

// Schema
const HonorSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  mobile: z
    .string()
    .min(7, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ"),
  achievement: z.string().min(1, "Thành tích là bắt buộc"),
  awardDate: z.string().optional(),
  description: z.string().optional(),
  photo: ImageSchema,
  isPublic: z.boolean().optional(),
});

type HonorCreateRequest = z.infer<typeof HonorSchema>;

export default function CreateHonorPage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<HonorCreateRequest>({
    resolver: zodResolver(HonorSchema),
    defaultValues: { isPublic: true },
  });

  const watchPhoto = watch("photo");

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("photo", file as File, { shouldValidate: true });
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setValue("photo", undefined as unknown as any);
      setPhotoPreview(null);
    }
  };

  const onSubmit = async (data: HonorCreateRequest) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("achievement", data.achievement);

      if (data.awardDate) {
        // send ISO string
        const iso = new Date(data.awardDate).toISOString();
        formData.append("awardDate", iso);
      }

      if (data.description) formData.append("description", data.description);

      if (data.photo) {
        formData.append("photo", data.photo);
      }

      // boolean -> string
      formData.append("isPublic", String(Boolean(data.isPublic)));

      // // Debug keys
      // for (const k of formData.keys()) console.log(k, formData.get(k));

      const res = await clientHttp(ApiResponseSchema(z.any()), {
        path: "/honor/create",
        method: "POST",
        body: formData,
      });

      if (res?.success) {
        toast.success("Tạo honor thành công");
        reset();
        setPhotoPreview(null);
        router.push("/admin/honor");
      } else {
        alert(res?.message || "Có lỗi khi tạo honor");
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
      <h1 className="text-2xl font-bold mb-6">Tạo Honor mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại *
            </label>
            <input
              type="tel"
              {...register("mobile")}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.mobile ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobile.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thành tích *
            </label>
            <input
              type="text"
              {...register("achievement")}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.achievement ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.achievement && (
              <p className="text-red-500 text-sm mt-1">
                {errors.achievement.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày đạt giải
            </label>
            <input
              type="date"
              {...register("awardDate")}
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            rows={4}
            {...register("description")}
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="w-40 h-40 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-sm text-center px-2">
                Preview ảnh
                <br />
                không có
              </div>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Ảnh (tuỳ chọn)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              className="mt-1 block w-full text-sm text-gray-600"
            />
            {errors.photo && (
              <p className="text-red-500 text-base mt-1">
                {errors.photo?.message}
              </p>
            )}

            <div className="mt-3 flex items-center gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register("isPublic")}
                  className="mr-2"
                />
                Công khai
              </label>

              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setValue("photo", undefined as unknown as any);
                }}
                className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm"
              >
                Xóa ảnh
              </button>
            </div>
          </div>
        </div>

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
            {isSubmitting ? "Đang gửi..." : "Tạo Honor"}
          </button>
        </div>
      </form>
    </div>
  );
}
