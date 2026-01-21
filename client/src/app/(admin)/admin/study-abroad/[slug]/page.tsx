"use client";

import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { TinyEditor } from "@/components/editor";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  CreateStudyAbroad,
  CreateStudyAbroadSchema,
  StudyAbroad,
  StudyAbroadSchema,
  UpdateStudyAbroad,
  UpdateStudyAbroadSchema,
} from "@/types";
import { Category, CategorySchema } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ImagePlus,
  Info,
  Link,
  Loader2,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import z from "zod";

export const dynamic = "force-dynamic";

export default function UpdateStudyAbroadPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [studyAbroad, setStudyAbroad] = useState<StudyAbroad | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const showSessionExpired = useSessionExpiredDialog();

  const [previews, setPreviews] = useState<string[] | undefined>(undefined);
  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    trigger,
    watch,
    control,
  } = useForm<UpdateStudyAbroad>({
    resolver: zodResolver(UpdateStudyAbroadSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
    },
  });

  const urlToFile = async (
    url: string,
    filename: string,
    mimeType = "image/png"
  ): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  };

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

  useEffect(() => {
    const fetchStudyAbroad = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(StudyAbroadSchema), {
          path: `/common/${slug}`,
          method: "GET",
        });

        if (res.data) {
          setStudyAbroad(res.data);
          reset({
            title: res.data.title,
            description: res.data.description || "",
            slug: res.data.slug,
            categoryId: res.data.category?.id,
            metaData: {
              metaTitle: res.data.metaData.metaTitle,
              metaDescription: res.data.metaData.metaDescription,
              metaKeywords: res.data.metaData.metaKeywords,
            },
          });
          setIsActive(res.data.isActive ?? true);

          if (Array.isArray(res.data.images) && res.data.images.length > 0) {
            // convert tất cả ảnh sang File[]
            const files = await Promise.all(
              res.data.images.map((imgUrl: string, idx: number) =>
                urlToFile(imgUrl, `image-${idx}.png`)
              )
            );

            let mainFiles: File[] = [...files];
            let mainPreviews: string[] = [...res.data.images];

            // xử lý ogImage (ảnh thứ 2 trong mảng)
            if (res.data.images.length > 1) {
              setOgImage(files[1]);
              setOgImagePreview(res.data.images[1]);

              // bỏ ogImage ra khỏi danh sách ảnh chính
              mainFiles = mainFiles.filter((_, idx) => idx !== 1);
              mainPreviews = mainPreviews.filter((_, idx) => idx !== 1);
            }
            // set previews còn lại + giá trị form
            setPreviews(mainPreviews);
            setValue("images", mainFiles as any, { shouldValidate: true });
          }
        }
      } catch (err: any) {
        console.error("Lỗi khi load chương trình:", err);
        if (err?.status === 429) {
          toast.warning("Vượt quá request, vui lòng refresh lại sau 60s");
        } else {
          toast.warning(err.message?.mes);
        }
      }
    };
    if (slug) fetchStudyAbroad();
  }, [slug, reset, setValue]);

  const onSubmit = async (data: CreateStudyAbroad) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("isActive", String(isActive));
      formData.append("categoryId", String(data.categoryId));

      formData.append("metaData", JSON.stringify(data.metaData));
      formData.append("type", "STUDYABROAD");

      if (Array.isArray(data.images)) {
        let finalImages = [...data.images];

        const removeDuplicate = (arr: File[], file: File) =>
          arr.filter((f) => !(f.name === file.name && f.size === file.size));

        if (ogImage) {
          finalImages = removeDuplicate(finalImages, ogImage);
          finalImages.splice(1, 0, ogImage);
        } else if (ogImagePreview) {
          // nếu không chọn file mới -> convert lại preview cũ sang File
          const file = await urlToFile(ogImagePreview, "og-image.png");
          finalImages.splice(1, 0, file);
        }

        // append toàn bộ vào formData
        finalImages.forEach((file) => {
          formData.append("images", file);
        });
      } else if (data.images) {
        formData.append("images", data.images);
      }

      await clientHttp(ApiResponseSchema(StudyAbroadSchema), {
        path: `/common/update/${studyAbroad?.id}`,
        method: "PUT",
        body: formData,
      });

      toast.success("Cập nhật bài viết thành công!");
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

  // Upload image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setOgImage(file);
    setOgImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    if (!previews) return previews || [];
    const newPreviews = [...previews];

    newPreviews.splice(idx, 1);
    setPreviews(newPreviews);
    // Lấy giá trị hiện tại trong form
    const currentFiles = getValues("images") || [];
    const newFiles = [...currentFiles];
    newFiles.splice(idx, 1);

    setValue("images", newFiles as any, { shouldValidate: true });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Cập nhật Chương Trình Du Học
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
          <label className="block text-lg font-semibold mb-2">Danh mục</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <select
                value={field.value || ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          />

          {typeof errors.categoryId?.message === "string" && (
            <p className="text-red-500 text-sm mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold mb-2">Mô tả</label>
          <TinyEditor
            key={getValues("description")}
            initialValue={getValues("description") || ""}
            onContentChange={(htmlContent) =>
              setValue("description", htmlContent)
            }
            height={400}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

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
                Kéo & thả ảnh vào đây hoặc nhấn để chọn
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
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
            {previews !== undefined && previews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {previews.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-xl border bg-gray-50"
                  >
                    <div className="aspect-[4/3] w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
        </section>

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
              {errors.metaData && (
                <p className="text-red-500 text-base mt-1">
                  {errors.metaData?.metaTitle?.message}
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
              {errors.metaData && (
                <p className="text-red-500 text-base mt-1">
                  {errors.metaData?.metaDescription?.message}
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
        <div className="flex justify-end mt-4">
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
