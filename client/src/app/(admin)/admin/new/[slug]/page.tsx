"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponse,
  ApiResponseSchema,
  New,
  NewSchema,
  UpdateNew,
  updateNewSchema,
} from "@/types";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";
import {
  CheckCircle,
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

export const dynamic = "force-dynamic";

export default function UpdateNewPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

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
  } = useForm<UpdateNew>({
    resolver: zodResolver(updateNewSchema),
    defaultValues: {
      images: [],
    },
  });

  const [previews, setPreviews] = useState<string[] | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setId] = useState<number | undefined>(undefined);
  const showSessionExpired = useSessionExpiredDialog();

  const [pressPreview, setPressPreview] = useState<string | null>(null);
  const [pressFile, setPressFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

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
        setCategories(res.data);
      }
    }

    fetchCategories();
  }, []);

  // Load dữ liệu new hiện tại
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(NewSchema), {
          path: `/common/${slug}`,
          method: "GET",
        });
        console.log("Fetch New: ", res);
        if (res.data) {
          const mataSEO = parseStringObject(res.data?.metaData);
          reset({
            title: res.data.title,
            description: res.data.description,
            url: res.data.url || "",
            categoryId: res.data.category?.id,
            forWeb: res.data.forWeb,
            isActive: res.data.isActive,
            slug: res.data.slug,
            metaData: mataSEO
              ? {
                  metaTitle: mataSEO.metaTitle || "",
                  metaDescription: mataSEO.metaDescription || "",
                  metaKeywords: mataSEO.metaKeywords || "",
                }
              : { metaTitle: "", metaDescription: "", metaKeywords: "" },
          });
          console.log("RES: ", res);

          setId(res.data.id);

          if (Array.isArray(res.data.images) && res.data.images.length > 0) {
            // convert tất cả ảnh sang File[]
            const files = await Promise.all(
              res.data.images.map((imgUrl: string, idx: number) =>
                urlToFile(imgUrl, `image-${idx}.png`)
              )
            );

            let mainFiles: File[] = [];
            let mainPreviews: string[] = [];

            res.data.images.forEach((imgUrl: string, idx: number) => {
              if (idx === 1) {
                // ogImage
                setOgImage(files[idx]);
                setOgImagePreview(imgUrl);
              } else if (
                parseStringObject(res.data?.category?.group)?.name ===
                  "báo chí" &&
                idx === 2
              ) {
                // pressFile
                setPressFile(files[idx]);
                setPressPreview(imgUrl);
              } else {
                // ảnh chính còn lại
                mainFiles.push(files[idx]);
                mainPreviews.push(imgUrl);
              }
            });

            // set previews còn lại + giá trị form
            setPreviews(mainPreviews);
            setValue("images", mainFiles as any, { shouldValidate: true });
          }
        }
      } catch (err: any) {
        console.error(err);
        if (err?.status === 429) {
          toast.warning("Vượt quá request, vui lòng refresh lại sau 60s");
        } else {
          toast.warning(err.message?.mes);
        }
      }
    };
    if (slug) fetchData();
  }, [slug, reset, setValue]);

  // Submit update
  const onSubmit = async (data: UpdateNew) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      if (data.url) formData.append("url", data.url);
      formData.append("categoryId", String(data.categoryId));
      formData.append("forWeb", data.forWeb || "");
      formData.append("metaData", JSON.stringify(data.metaData));
      formData.append("type", "NEW");
      formData.append("isActive", String(data.isActive));

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

        if (selectCategoryGroup?.name === "báo chí") {
          if (pressFile) {
            finalImages = removeDuplicate(finalImages, pressFile);
            finalImages.splice(2, 0, pressFile);
          } else if (pressPreview) {
            // nếu không chọn file mới => convert lại preview cũ sang File
            const file = await urlToFile(pressPreview, "press-icon.png");
            finalImages.splice(2, 0, file);
          }
        }

        // append toàn bộ vào formData
        finalImages.forEach((file) => {
          formData.append("images", file);
        });
      } else if (data.images) {
        formData.append("images", data.images);
      }

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log("FormData file:", key, value.name, value.size);
        } else {
          console.log("FormData:", key, value);
        }
      }

      await clientHttp(ApiResponseSchema(updateNewSchema), {
        path: `/common/update/${id}`,
        method: "PUT",
        body: formData,
      });

      toast.success("Cập nhật tin tức thành công!");
      router.push("/admin/new");
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

  const selectedCategoryId = watch("categoryId");
  const selectedCategory = categories.find(
    (cat) => cat.id === Number(selectedCategoryId)
  );
  const selectCategoryGroup = parseStringObject(selectedCategory?.group);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Cập Nhật Tin Tức
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
      >
        {/* Title */}
        <div>
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
            {typeof errors.categoryId?.message === "string" && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.categoryId?.message}
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

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold mb-2">Nội dung</label>
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
            <p className="text-red-500 text-sm mt-1">{errors.forWeb.message}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <header className="mb-5 flex items-center gap-2 border-b pb-3">
            <ImagePlus className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Hình ảnh</h2>
          </header>

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
          {previews !== undefined && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
              {previews.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full opacity-80 hover:opacity-100 shadow"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectCategoryGroup?.name === "báo chí" && (
          <section className="rounded-2xl border bg-white p-4 shadow-sm w-1/2">
            <header className="mb-4 flex items-center justify-center gap-2 border-b pb-2">
              <ImagePlus className="h-5 w-5 text-gray-700" />
              <h2 className="text-base font-semibold">Icon Báo chí</h2>
            </header>

            <div className="flex items-center justify-center gap-12 px-5">
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-blue-400">
                <UploadCloud className="h-6 w-6 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-600">Chọn ảnh</span>
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

        {/* Active */}
        <div>
          <label className="block text-lg font-semibold mb-2">Trạng thái</label>
          <Controller
            name="isActive"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <select
                value={field.value ? "true" : "false"}
                onChange={(e) => field.onChange(e.target.value === "true")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            )}
          />
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
                Cập nhật bài viết
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
