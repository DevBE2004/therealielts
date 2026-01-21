// app/admin/study-abroad/create/page.tsx
"use client";

import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { TinyEditor } from "@/components/editor";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  CreateStudyAbroad,
  CreateStudyAbroadSchema,
} from "@/types";
import { Category, CategorySchema } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { tr } from "date-fns/locale";
import {
  CheckCircle,
  CheckCircle2,
  ImagePlus,
  Info,
  Link,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import z from "zod";

export default function CreateStudyAbroadPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    control,
    watch,
  } = useForm<CreateStudyAbroad>({
    resolver: zodResolver(CreateStudyAbroadSchema),
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const showSessionExpired = useSessionExpiredDialog();

  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const res = await clientHttp(ApiResponseSchema(z.array(CategorySchema)), {
        path: "/category",
        method: "GET",
        query: { limit: 1000, page: 1 },
      });
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data.filter((c) => c.group?.name === "du học"));
      }
    }

    fetchCategories();
  }, []);

  const onSubmit = async (data: CreateStudyAbroad) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("isActive", String(isActive));
      formData.append("type", "STUDYABROAD");
      formData.append("metaData", JSON.stringify(data.metaData));
      formData.append("categoryId", String(data.categoryId));

      // Images
      if (Array.isArray(data.images)) {
        let finalImages = [...data.images];

        if (ogImage) {
          // ép ogImage vào vị trí thứ 2
          if (finalImages.length >= 2) {
            finalImages.splice(1, 0, ogImage);
          } else {
            finalImages.push(ogImage);
          }
        }
        finalImages.forEach((file) => {
          formData.append("images", file);
        });
      } else if (data.images) {
        formData.append("images", data.images);
      }

      await clientHttp(ApiResponseSchema(CreateStudyAbroadSchema), {
        path: "/common/create",
        method: "POST",
        body: formData,
      });

      toast.success("Tạo chương trình du học thành công!");
      router.push("/admin/study-abroad");
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

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 5);
    setValue("images", fileArray as any, { shouldValidate: true });
    trigger("images");

    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    e.target.value = "";
  };

  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOgImage(file);
    setOgImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    const files = [...(previews || [])];
    files.splice(idx, 1);
    setPreviews(files);
    const currentFiles = files as any as File[];
    setValue("images", currentFiles, { shouldValidate: true });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Tạo Chương Trình Du Học Mới
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Tiêu đề</label>
          <input
            type="text"
            {...register("title")}
            className="w-full rounded-lg border px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Nhập tiêu đề"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2 md:col-span-2 w-full lg:w-2/3">
          <label className="text-sm font-medium">Đường dẫn URL *</label>
          <div className="relative">
            <input
              type="text"
              {...register("slug")}
              className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.slug ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="VD: bai-viet-1"
            />
            <Link className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Preview */}
          <p className="text-sm font-[500] text-gray-600">
            URL hiển thị:{" "}
            <span className="font-medium text-base text-blue-600">
              https://therealielts.vn/{watch("slug") || "slug-cua-ban"}
            </span>
          </p>

          {/* Error */}
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-base font-medium mb-2">Phân loại</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Chọn phân loại --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Nội dung
          </h2>
          <TinyEditor
            initialValue=""
            onContentChange={(htmlContent) =>
              setValue("description", htmlContent)
            }
            height={400}
          />
        </div>

        {/* Card: Hình ảnh */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <header className="mb-5 flex items-center gap-2 border-b pb-3">
            <ImagePlus className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Ảnh bìa</h2>
          </header>

          <div className="space-y-4">
            {/* Drop zone style input */}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
              <UploadCloud className="h-6 w-6" />
              <span className="text-base text-gray-600">Nhấn để chọn ảnh</span>
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
                        className="h-full w-full object-cover"
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cài đặt</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isActive === true}
                onChange={() => setIsActive(true)}
                className="h-4 w-4"
              />
              <span>Hoạt động</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isActive === false}
                onChange={() => setIsActive(false)}
                className="h-4 w-4"
              />
              <span>Không hoạt động</span>
            </label>
          </div>
        </div>

        {/* Card: Metadata / SEO */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <header className="mb-6 flex items-center gap-2 border-b pb-3">
            <Info className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Thông tin SEO / Metadata</h2>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: Metadata fields */}
            <div className="space-y-6 lg:col-span-2">
              {/* Meta Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Title *</label>
                <input
                  type="text"
                  {...register("metaData.metaTitle")}
                  className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.metaData?.metaTitle
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />
                {errors.metaData?.metaTitle && (
                  <p className="text-sm text-red-500">
                    {errors.metaData.metaTitle.message}
                  </p>
                )}
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Meta Description *
                </label>
                <textarea
                  rows={3}
                  {...register("metaData.metaDescription")}
                  className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.metaData?.metaDescription
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />
                {errors.metaData?.metaDescription && (
                  <p className="text-sm text-red-500">
                    {errors.metaData.metaDescription.message}
                  </p>
                )}
              </div>

              {/* Meta Keywords */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Meta Keywords (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  {...register("metaData.metaKeywords")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm"
                  placeholder="ví dụ: khóa học IELTS, Luyện thi Ielts, Lộ trình Ielts"
                />
              </div>
            </div>

            {/* Right: OG Image */}
            <div className="rounded-2xl border bg-gray-50 p-4 shadow-sm flex flex-col items-center justify-center">
              <header className="mb-3 flex items-center gap-2 border-b pb-2 w-full justify-center">
                <ImagePlus className="h-5 w-5 text-gray-700" />
                <h3 className="text-base font-semibold">Ảnh meta *</h3>
              </header>

              <div className="flex flex-col items-center gap-4">
                {/* Upload button */}
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed border-gray-300 bg-white text-center transition hover:border-blue-400">
                  <UploadCloud className="h-6 w-6 text-gray-500 shrink-0" />
                  <span className="text-sm text-gray-600">Chọn ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOgImageChange}
                    className="hidden"
                  />
                </label>

                {/* Preview */}
                {ogImagePreview && (
                  <div className="relative h-28 w-40">
                    <img
                      src={ogImagePreview}
                      alt="og-preview"
                      className="h-full w-full object-cover rounded-lg border bg-white shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setOgImage(null);
                        setOgImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
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
                Tạo bài viết
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
