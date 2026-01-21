"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, CreateNew, CreateNewSchema } from "@/types";
import { useRouter } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";
import {
  CheckCircle2,
  Globe,
  ImagePlus,
  Info,
  Link,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { TinyEditor } from "@/components/editor";
import { Category, CategorySchema } from "@/types/category";
import { parseStringObject } from "@/hooks/parseStringObject";

export default function CreateNewPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<CreateNew>({
    resolver: zodResolver(CreateNewSchema),
    defaultValues: {
      images: [],
      forWeb: "THEREALIELTS",
    },
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showSessionExpired = useSessionExpiredDialog();

  const [pressPreview, setPressPreview] = useState<string | null>(null);
  const [pressFile, setPressFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find(
    (cat) => cat.id === Number(selectedCategoryId)
  );
  const selectCategoryGroup = parseStringObject(selectedCategory?.group);

  useEffect(() => {
    async function fetchCategories() {
      const res = await clientHttp(ApiResponseSchema(z.array(CategorySchema)), {
        path: "/category",
        method: "GET",
        query: { limit: 100 },
      });
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    }

    fetchCategories();
  }, []);

  const onSubmit = async (data: CreateNew) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      if (data.url) formData.append("url", data.url);
      formData.append("categoryId", String(data.categoryId));
      formData.append("forWeb", slugify(data.forWeb));
      formData.append("type", "NEW");
      formData.append("metaData", JSON.stringify(data.metaData));
      formData.append("isActive", String(data.isActive));

      if (Array.isArray(data.images)) {
        let finalImages = [...data.images];

        if (ogImage) {
          if (finalImages.length >= 2) {
            finalImages.splice(1, 0, ogImage);
          } else {
            finalImages.push(ogImage);
          }
        }

        if (selectCategoryGroup?.name === "báo chí" && pressFile) {
          if (finalImages.length >= 3) {
            finalImages.splice(2, 0, pressFile);
          } else {
            finalImages.push(pressFile);
          }
        }
        finalImages.forEach((file) => {
          formData.append("images", file);
        });
      } else if (data.images) {
        formData.append("images", data.images);
      }

      await clientHttp(ApiResponseSchema(CreateNewSchema), {
        path: "/common/create",
        method: "POST",
        body: formData,
      });

      toast.success("Tạo tin tức thành công!");
      reset();
      setPreviews([]);
      router.push("/admin/new");
    } catch (err: any) {
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
  };

  const handlePressImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPressFile(file);
    setPressPreview(URL.createObjectURL(file));
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
    const newFiles = [...(previews || [])];
    newFiles.splice(idx, 1);
    setPreviews(newFiles);
    const currentFiles = newFiles as any as File[];
    setValue("images", currentFiles, { shouldValidate: true });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tạo Tin Mới</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-10"
      >
        {/* Nhóm: Tiêu đề */}
        <section>
          <label className="block text-lg font-semibold mb-2">Tiêu đề</label>
          <input
            type="text"
            {...register("title")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập tiêu đề tin tức"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </section>

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

        {/* Nhóm: Category + URL */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-2">
              Phân loại
            </label>
            <select
              {...register("categoryId", {
                required: "Vui lòng chọn danh mục",
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">
              Link Báo Chí
            </label>
            <input
              type="url"
              {...register("url")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://example.com"
            />
          </div>
        </section>

        {/* Nhóm: Description */}
        <section>
          <label className="block text-lg font-semibold mb-2">Nội dung</label>
          <TinyEditor
            initialValue=""
            onContentChange={(htmlContent) =>
              setValue("description", htmlContent)
            }
            height={400}
          />
        </section>

        {/* Nhóm: ForWeb */}
        <section>
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
        </section>

        {/* Nhóm: Hình ảnh */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <header className="mb-5 flex items-center gap-2 border-b pb-3">
            <ImagePlus className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Hình ảnh</h2>
          </header>

          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400">
              <UploadCloud className="h-7 w-7" />
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
                <p key={idx} className="text-red-500 text-base mt-1">
                  {err?.message as string}
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
        </section>

        {/* Nhóm: Icon Báo chí */}
        {selectCategoryGroup?.name === "báo chí" && (
          <section className="rounded-2xl border bg-white p-4 shadow-sm w-1/2">
            <header className="mb-4 flex items-center justify-center gap-2 border-b pb-2">
              <ImagePlus className="h-5 w-5 text-gray-700" />
              <h2 className="text-base font-semibold">Icon Báo chí</h2>
            </header>

            <div className="flex items-center justify-center gap-12 px-5">
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-blue-400">
                <UploadCloud className="h-6 w-6 text-gray-500 shrink-0" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePressImageChange}
                  className="hidden"
                />
              </label>

              {pressPreview && (
                <div className="relative h-24 w-24">
                  <img
                    src={pressPreview}
                    alt="press-preview"
                    className="h-full w-full rounded-full object-contain object-center border bg-white shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPressFile(null);
                      setPressPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Nhóm: Trạng thái */}
        <section>
          <label className="block text-lg font-semibold mb-2">Trạng thái</label>
          <select
            {...register("isActive", {
              setValueAs: (v) => v === "true",
            })}
            defaultValue="true"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow"
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
