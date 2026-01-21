"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  PartnerSchema,
  PartnerUpdateRequest,
  PartnerUpdateRequestSchema,
} from "@/types";

import {
  BookOpen,
  ImagePlus,
  Layers,
  Loader2,
  Trash2,
  Upload,
  CheckCircle2,
  Info,
  Handshake,
  Globe,
} from "lucide-react";
import { toast } from "react-toastify";
import slugify from "slugify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";

export default function UpdatePartner() {
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const showSessionExpired = useSessionExpiredDialog();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm<PartnerUpdateRequest>({
    resolver: zodResolver(PartnerUpdateRequestSchema),
  });

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // Lấy Partner
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(PartnerSchema), {
          path: `/partner/${id}`,
          method: "GET",
        });
        if (res.data) {
          reset({
            name: res.data.name,
            category: res.data.category,
            description: res.data.description || "",
            forWeb: res.data.forWeb,
            images: [],
          });
          if (res.data?.images.length) {
            const files = await Promise.all(
              res.data.images.map((imgUrl, idx) => {
                if (typeof imgUrl === "string") {
                  return urlToFile(imgUrl, `image-${idx}.png`);
                }
                return imgUrl as File;
              })
            );
            setUploadedImages(files);
            setValue("images", files, { shouldValidate: true });
          }
        }
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu!");
      }
    };
    if (id) fetchData();
  }, [id, reset, setValue]);

  const previews = useMemo(
    () => uploadedImages.map((f) => URL.createObjectURL(f)),
    [uploadedImages]
  );

  // ----- Image handlers -----
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const next = [...uploadedImages, ...Array.from(files)].slice(0, 5);
    setUploadedImages(next);
    setValue("images", next as any, { shouldValidate: true });
    trigger("images");
  };

  const removeImage = (index: number) => {
    const next = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(next);
    setValue("images", next as any, { shouldValidate: true });
  };

  const onSubmit = async (data: PartnerUpdateRequest) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name || "");
      formData.append("category", data.category || "");
      formData.append("description", data.description || "");
      formData.append("forWeb", data.forWeb || "");

      uploadedImages.forEach((file) => {
        formData.append("images", file);
      });

      const response = await clientHttp(ApiResponseSchema(z.any()), {
        path: `/partner/update/${id}`,
        method: "PUT",
        body: formData,
      });

      if (response.success) {
        toast.success("Cập nhật thành công");
        router.push("/admin/partner");
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
    <div className="mx-auto max-w-6xl p-6">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Handshake className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight">
            Thêm Đối Tác Mới
          </h1>
        </div>
        <div className="hidden items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-sm text-blue-800 md:flex">
          <Info className="h-4 w-4" />
          Nhập đầy đủ thông tin, tối thiểu 1 ảnh.
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Card: Thông tin cơ bản */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <header className="mb-5 flex items-center gap-2 border-b pb-3">
            <Layers className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Tên đối tác</label>
              <div className="relative">
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <BookOpen className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-base font-medium mb-2">
                Thuộc nhóm
              </label>
              <select
                {...register("category")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Chọn
                </option>
                <option value="Đối tác chiến lược">Đối tác chiến lược</option>
                <option value="Đối tác giáo dục">Đối tác giáo dục</option>
                <option value="Đối tác công nghệ">Đối tác công nghệ</option>
                <option value="Đối tác truyền thông">
                  Đối tác truyền thông
                </option>
                <option value="Đối tác tài chính">Đối tác tài chính</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Mô tả</label>
              <textarea
                rows={4}
                {...register("description")}
                className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* ForWeb */}
            <div>
              <label className="block text-base font-medium mb-2 flex items-center gap-2 text-gray-700">
                <Globe className="w-4 h-4 text-blue-500" /> Website hiển thị
              </label>
              <select
                {...register("forWeb")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LINGOSPEAK">LINGO SPEAK</option>
                <option value="THEREALIELTS">THE REAL IELTS</option>
                <option value="PTEBOOSTER">PTE BOOSTER</option>
              </select>
              {errors.forWeb && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.forWeb.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Card: Hình ảnh */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <header className="mb-5 flex items-center gap-2 border-b pb-3">
            <ImagePlus className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Hình ảnh khóa học</h2>
          </header>

          <div className="space-y-4">
            {/* Drop zone style input */}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
              <Upload className="h-6 w-6" />
              <span className="text-sm text-gray-600">
                Kéo & thả ảnh vào đây hoặc nhấn để chọn (tối đa 5 ảnh)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesChange}
                className="hidden"
              />
            </label>
            {errors.images &&
              Array.isArray(errors.images) &&
              errors.images.map((err, idx) => (
                <p key={idx} className="text-base text-red-500">
                  {err?.message}
                </p>
              ))}

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {previews.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-xl border bg-gray-50"
                  >
                    <div className="aspect-[4/3] w-full">
                      <img
                        src={url}
                        alt={`preview-${idx}`}
                        className="h-44 w-44 object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      title="Xóa ảnh"
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 hidden items-center justify-between bg-gradient-to-t from-black/50 to-transparent px-3 py-2 text-xs text-white group-hover:flex">
                      <span>Ảnh {idx + 1}</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Cập nhật
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
