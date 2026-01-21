"use client";

import { use, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  ImageSchema,
  metaDataSchema,
  slugSchema,
} from "@/types";
import { useRouter } from "next/navigation";
import { z, ZodError } from "zod";
import slugify from "slugify";
import {
  CheckCircle2,
  ImagePlus,
  Info,
  Link,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { TinyEditor } from "@/components/editor";
import { useAppSelector } from "@/store";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { Category, CategorySchema } from "@/types/category";

const CreateDocumentSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  // categoryName: z
  //   .object({
  //     value: z.string(),
  //     label: z.string(),
  //   })
  //   .optional(),
  // categoryGroup: z
  //   .object({
  //     value: z.string(),
  //     label: z.string(),
  //   })
  //   .optional(),
  categoryId: z.string(),
  metaData: metaDataSchema,
  slug: slugSchema,
  images: z
    .array(ImageSchema)
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),
  isActive: z.boolean().optional(),
});

type CreateDocument = z.infer<typeof CreateDocumentSchema>;

export default function DocumentCreatePage() {
  const router = useRouter();
  const { current } = useAppSelector((state) => state.user);
  const showSessionExpired = useSessionExpiredDialog();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    trigger,
    watch,
    getValues,
  } = useForm<CreateDocument>({
    resolver: zodResolver(CreateDocumentSchema),
  });

  console.log("Errors: ", errors);

  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  const defaultNames = [
    "Writing Task",
    "Listening",
    "Speaking",
    "Đề thi IELTS",
    "Từ vựng IELTS",
  ];

  useEffect(() => {
    async function fetchCategories() {
      const res = await clientHttp(ApiResponseSchema(z.array(CategorySchema)), {
        path: "/category",
        method: "GET",
        query: { limit: 1000, page: 1 },
      });
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    }

    fetchCategories();
  }, []);

  // useEffect(() => {
  //   async function fetchDocs() {
  //     const res = await clientHttp(ApiResponseSchema(z.any()), {
  //       path: "/common",
  //       method: "GET",
  //       query: { limit: 9999, type: "DOCUMENT" },
  //     });
  //     if (res.success) {
  //       setDocuments(res.data);
  //     }
  //   }
  //   fetchDocs();
  // }, []);

  // const categoryNames = useMemo(() => {
  //   const namesFromDocs = documents
  //     .map((d) => d.category?.name)
  //     .filter(Boolean) as string[];
  //   return Array.from(new Set([...defaultNames, ...namesFromDocs]));
  // }, [documents]);

  // // lấy unique category.group
  // const categoryGroups = useMemo(() => {
  //   const groups = documents
  //     .map((d) => d.category?.group)
  //     .filter(Boolean) as string[];
  //   return Array.from(new Set(groups));
  // }, [documents]);

  // const nameOptions = categoryNames.map((n) => ({ value: n, label: n }));
  // const groupOptions = categoryGroups.map((g) => ({ value: g, label: g }));

  const onSubmit = async (data: CreateDocument) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("isActive", String(data.isActive));
      formData.append("type", "DOCUMENT");
      formData.append("metaData", JSON.stringify(data.metaData));
      // formData.append(
      //   "category",
      //   JSON.stringify({
      //     name: data.categoryName?.value || "",
      //     group: data.categoryGroup?.value || "",
      //   })
      // );
      formData.append("categoryId", String(data.categoryId));
      formData.append("authorId", String(current?.id || ""));

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

      await clientHttp(ApiResponseSchema(CreateDocumentSchema), {
        path: "/common/create",
        method: "POST",
        body: formData,
      });

      toast.success("Tạo tài liệu thành công!");
      reset();
      setPreviews([]);
      router.push("/admin/document");
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
    const files = e.target.files;
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
    // if(!validateImage(file)) return;
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
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-10 text-gray-900">
        ✨ Tạo tài liệu mới
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg p-10 space-y-10"
      >
        {/* Section: Thông tin chính */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Thông tin cơ bản
          </h2>

          {/* Title */}
          <div>
            <label className="block text-base font-medium mb-2">Tiêu đề</label>
            <input
              type="text"
              {...register("title")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tiêu đề tài liệu"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <section className="space-y-2 md:col-span-2 w-full lg:w-2/3">
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
          </section>

          {/* Category */}
          <div>
            <label className="block text-base font-medium mb-2">
              Phân loại
            </label>
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
                      {c.name} {c.group?.name ? `- ${c.group.name}` : ""}
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
        </section>

        {/* Section: Nội dung */}
        <section className="space-y-4">
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
        </section>

        {/* Section: Hình ảnh & Tác giả */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
          <header className="mb-3 flex items-center gap-2 border-b pb-3">
            <UploadCloud className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-700">
              Ảnh & Tác giả
            </h2>
          </header>

          <p className="text-gray-600 text-lg">
            <span className="font-medium">Tác giả:</span> {current?.name}
          </p>

          {/* Nhóm: Hình ảnh */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <header className="mb-5 flex items-center gap-2 border-b pb-3">
              <ImagePlus className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Hình ảnh</h2>
            </header>

            <div className="space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
                <UploadCloud className="h-7 w-7" />
                <span className="text-base text-gray-600">
                  Nhấn để chọn ảnh
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
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section: Cài đặt */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Cài đặt
          </h2>
          <div>
            <label className="block mb-2 text-base font-medium">
              Trạng thái tài liệu
            </label>
            <select
              {...register("isActive", {
                setValueAs: (v) => v === "true",
              })}
              defaultValue="true"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>
        </section>

        {/* Nhóm: Metadata / SEO */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <header className="mb-6 flex items-center gap-2 border-b pb-3">
            <Info className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Thông tin SEO / Metadata</h2>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Title *</label>
                <input
                  type="text"
                  {...register("metaData.metaTitle")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.metaData?.metaTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.metaData.metaTitle.message}
                </p>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Meta Description *
                </label>
                <textarea
                  rows={3}
                  {...register("metaData.metaDescription")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.metaData?.metaDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.metaData.metaDescription.message}
                </p>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Meta Keywords (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  {...register("metaData.metaKeywords")}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm"
                />
              </div>
            </div>

            {/* OG Image */}
            <div className="rounded-2xl border bg-gray-50 p-4 shadow-sm flex flex-col items-center justify-center">
              <header className="mb-3 flex items-center gap-2 border-b pb-2 w-full justify-center">
                <ImagePlus className="h-5 w-5 text-gray-700" />
                <h3 className="text-base font-semibold">Ảnh meta *</h3>
              </header>

              <div className="flex flex-col items-center gap-4">
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed border-gray-300 bg-white transition hover:border-blue-400">
                  <UploadCloud className="h-6 w-6 text-gray-500 shrink-0" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOgImageChange}
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
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
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
      </form>
    </div>
  );
}
