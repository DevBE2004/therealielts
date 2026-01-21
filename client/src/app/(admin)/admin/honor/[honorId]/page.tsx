"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, HonorSchema, ImageSchema } from "@/types";
import { toast } from "react-toastify";
import slugify from "slugify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";

export const dynamic = "force-dynamic";

// Schema giống Create
const HonorUpdateSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  mobile: z.string().min(7).max(15),
  achievement: z.string().min(1, "Thành tích là bắt buộc"),
  awardDate: z.string().optional(),
  description: z.string().optional(),
  photo: ImageSchema.optional(),
  isPublic: z.boolean().optional(),
});

type HonorUpdateRequest = z.infer<typeof HonorUpdateSchema>;

async function urlToFile(
  url: string,
  filename: string,
  mimeType = "image/png"
): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
}

export default function UpdateHonorPage() {
  const router = useRouter();
  const { honorId } = useParams();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [oldPhotoUrl, setOldPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<HonorUpdateRequest>({
    resolver: zodResolver(HonorUpdateSchema),
  });

  const watchPhoto = watch("photo");

  useEffect(() => {
    async function fetchDetail() {
      if (!honorId) return;
      const res = await clientHttp(ApiResponseSchema(HonorSchema), {
        method: "GET",
        path: `/honor/${honorId}`,
      });

      if (res.success && res.data) {
        const honor = res.data;
        reset({
          name: honor.name,
          email: honor.email,
          mobile: honor.mobile,
          achievement: honor.achievement,
          awardDate: honor.awardDate
            ? new Date(honor.awardDate).toISOString().split("T")[0]
            : "",
          description: honor.description,
          isPublic: honor.isPublic,
          photo: undefined,
        });
        if (honor.photo) {
          setPhotoPreview(honor.photo);
          setOldPhotoUrl(honor.photo);
        }
      }
    }
    fetchDetail();
  }, [honorId, reset]);

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("photo", file as File, { shouldValidate: true });
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setValue("photo", undefined);
      setPhotoPreview(oldPhotoUrl || null);
    }
  };

  const onSubmit = async (data: HonorUpdateRequest) => {
    if (!honorId) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("achievement", data.achievement);

      if (data.awardDate) {
        const iso = new Date(data.awardDate).toISOString();
        formData.append("awardDate", iso);
      }

      if (data.description) formData.append("description", data.description);

      if (data.photo instanceof File) {
        formData.append("photo", data.photo);
      } else if (oldPhotoUrl && !data.photo) {
        const file = await urlToFile(oldPhotoUrl, "old-photo.png");
        formData.append("photo", file);
      }

      formData.append("isPublic", String(Boolean(data.isPublic)));

      const res = await clientHttp(z.any(), {
        path: `/honor/update/${honorId}`,
        method: "PUT",
        body: formData,
      });

      if (res?.success) {
        toast.success("Cập nhật honor thành công");
        router.push("/admin/honor");
      } else {
        alert(res?.message || "Có lỗi khi cập nhật honor");
      }
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning("Email đã tồn tại ở học viên khác!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Cập nhật Honor</h1>

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

          {/* Mobile */}
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

          {/* Achievement */}
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

          {/* Award date */}
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

        {/* Description */}
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

        {/* Photo */}
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
              <p className="text-red-500 text-sm mt-1">
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
                  setValue("photo", undefined);
                }}
                className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm"
              >
                Xóa ảnh
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
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật Honor"}
          </button>
        </div>
      </form>
    </div>
  );
}
