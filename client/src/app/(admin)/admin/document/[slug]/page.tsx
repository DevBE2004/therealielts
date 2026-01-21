"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  DocumentSchema,
  ImageSchema,
  metaDataSchema,
  slugSchema,
  User,
  UserSchema,
} from "@/types";
import { useRouter, useParams } from "next/navigation";
import { set, z } from "zod";
import slugify from "slugify";
import {
  CheckCircle,
  Trash2,
  UploadCloud,
  User as UserIcon,
  Calendar,
  CheckCircle2,
  Upload,
  ImagePlus,
  Info,
  Link,
} from "lucide-react";
import { TinyEditor } from "@/components/editor";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { Category, CategorySchema } from "@/types/category";
import { parseStringObject } from "@/hooks/parseStringObject";

const UpdateDocumentSchema = z.object({
  id: z.number().optional(),
  author: UserSchema.optional(),
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
  categoryId: z.number().optional(),
  slug: slugSchema,
  metaData: metaDataSchema,
  images: z
    .array(ImageSchema)
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),
  isActive: z.boolean().optional(),
  updatedAt: z.date().optional(),
});

type UpdateDocument = z.infer<typeof UpdateDocumentSchema>;

export default function UpdateDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  console.log("Editing document with slug:", slug);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    control,
    watch,
    trigger,
  } = useForm<UpdateDocument>({
    resolver: zodResolver(UpdateDocumentSchema),
  });
  const [previews, setPreviews] = useState<string[] | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [id, setId] = useState<number | undefined>();
  const [author, setAuthor] = useState<User | undefined>();
  const [date, setDate] = useState<Date | null>(null);
  const showSessionExpired = useSessionExpiredDialog();
  const [categories, setCategories] = useState<Category[]>([]);

  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  // convert url -> file để append vào formData
  const urlToFile = async (
    url: string,
    filename: string,
    mimeType = "image/webp"
  ): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  };

  // useEffect(() => {
  //   async function fetchDocs() {
  //     const res = await clientHttp(ApiResponseSchema(z.any()), {
  //       path: "/common",
  //       method: "GET",
  //       query: { type: "DOCUMENT", limit: 9999 },
  //     });
  //     if (res.success) setDocuments(res.data);
  //   }
  //   fetchDocs();
  // }, []);

  // const defaultNames = [
  //   "Writing Task",
  //   "Listening",
  //   "Speaking",
  //   "Đề thi IELTS",
  //   "Từ vựng IELTS",
  // ];

  // const categoryNames = useMemo(() => {
  //   const namesFromDocs = documents
  //     .map((d) => d.category?.name)
  //     .filter(Boolean) as string[];
  //   return Array.from(new Set([...defaultNames, ...namesFromDocs]));
  // }, [documents]);

  // const categoryGroups = useMemo(() => {
  //   const groups = documents
  //     .map((d) => d.category?.group)
  //     .filter(Boolean) as string[];
  //   return Array.from(new Set(groups));
  // }, [documents]);

  // const nameOptions = categoryNames.map((n) => ({ value: n, label: n }));
  // const groupOptions = categoryGroups.map((g) => ({ value: g, label: g }));

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

  // Load dữ liệu document hiện tại
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(DocumentSchema), {
          path: `/common/${slug}`,
          method: "GET",
        });

        console.log("Fetched document data:", res);

        if (!res?.data) {
          alert("Không có dữ liệu!");
          return;
        }
        const mataSEO = parseStringObject(res.data?.metaData);

        reset({
          title: res.data.title,
          description: res.data.description,
          isActive: res.data.isActive,
          // categoryName: res.data.category?.name
          //   ? { value: res.data.category.name, label: res.data.category.name }
          //   : undefined,
          // categoryGroup: res.data.category?.group
          //   ? { value: res.data.category.group, label: res.data.category.group }
          //   : undefined,
          categoryId: res.data.category?.id,
          slug: res.data.slug,
          metaData: mataSEO
            ? {
                metaTitle: mataSEO.metaTitle || "",
                metaDescription: mataSEO.metaDescription || "",
                metaKeywords: mataSEO.metaKeywords || "",
              }
            : { metaTitle: "", metaDescription: "", metaKeywords: "" },
        });

        setId(res.data.id);
        setDate(res.data.updatedAt ? new Date(res.data.updatedAt) : null);
        setAuthor(res.data.author);

        if (
          Array.isArray(res.data.images) &&
          res.data.images.length > 0 &&
          res.data.images.every((img) => typeof img === "string")
        ) {
          // console.log("res.data.images", res.data.images)
          try {
            const files = await Promise.all(
              res.data.images.map((imgUrl: string, idx: number) =>
                urlToFile(imgUrl, `${res.data?.slug}-${idx}.webp`)
              )
            );

            // console.log("FILES FILES: ", files);

            let mainFiles: File[] = [...files];
            let mainPreviews: string[] = [...res.data.images];

            if (res.data.images.length > 1) {
              setOgImage(files[1]);
              setOgImagePreview(res.data.images[1]);
              mainFiles = mainFiles.filter((_, idx) => idx !== 1);
              mainPreviews = mainPreviews.filter((_, idx) => idx !== 1);
            }

            setPreviews(mainPreviews);
            setValue("images", mainFiles as any, { shouldValidate: true });
          } catch (err) {
            console.error("Lỗi convert ảnh:", err);
          }
        }
      } catch (err: any) {
        console.error("Fetch document error:", err);
        if (err?.status === 429) {
          toast.warning("Vượt quá request, vui lòng refresh lại sau 60s");
        }
      }
    };

    if (slug) fetchData();
  }, [slug, reset, setValue]);

  // Submit update
  const onSubmit = async (data: UpdateDocument) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("isActive", String(data.isActive));
      // formData.append(
      //   "category",
      //   JSON.stringify({
      //     name: data.categoryName?.value || "",
      //     group: data.categoryGroup?.value || "",
      //   })
      // );

      formData.append("categoryId", String(data.categoryId));

      formData.append("metaData", JSON.stringify(data.metaData));
      formData.append("type", "DOCUMENT");

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

      await clientHttp(ApiResponseSchema(UpdateDocumentSchema), {
        path: `/common/update/${id}`,
        method: "PUT",
        body: formData,
      });

      toast.success("Cập nhật tài liệu thành công!");
      router.push("/admin/document");
    } catch (err: any) {
      console.log("Error: ", err);
      if (err?.status === 429) {
        toast.warning(
          err.message?.mes || "Vượt quá request, vui lòng thử lại sau 60s"
        );
      } else if (
        slugify(err.message?.mes, { lower: true, locale: "vi-VN" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
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
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">
        ✏️ Cập Nhật Tài Liệu
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-xl p-8 space-y-10"
      >
        {/* Metadata */}
        <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>
              Lần cập nhật:{" "}
              <strong>
                {date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Chưa có"}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <UserIcon className="w-5 h-5 text-green-500" />
            <span>
              Người cập nhật: <strong>{author?.name ?? "Không rõ"}</strong>
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-lg font-semibold mb-2">Tiêu đề</label>
          <input
            type="text"
            {...register("title")}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập tiêu đề tài liệu"
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
                    Phân loại: {cat.name}{" "}
                    {cat.group?.name ? `- Thuộc nhóm: ${cat.group.name}` : ""}
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
            {errors.images && (
              <p className="text-base text-red-500">{errors.images.message}</p>
            )}

            {/* Lỗi từng phần tử */}
            {Array.isArray(errors.images) &&
              errors.images.map(
                (err, idx) =>
                  err && (
                    <p key={idx} className="text-base text-red-500">
                      Ảnh {idx + 1}: {err.message}
                    </p>
                  )
              )}

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

        {/* Active */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
            Cài đặt
          </h2>
          <div>
            <label className="block mb-2 text-base font-medium">
              Trạng thái tài liệu
            </label>
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
                <p className="text-base text-red-500">
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
                <p className="text-base text-red-500">
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
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg shadow transition ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            "Đang cập nhật..."
          ) : (
            <>
              <CheckCircle className="w-5 h-5" /> Cập Nhật Tài Liệu
            </>
          )}
        </button>
      </form>
    </div>
  );
}
