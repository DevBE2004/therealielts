"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  ImageSchema,
  metaDataSchema,
  slugSchema,
} from "@/types";
import { RoadmapSchema } from "@/types/roadmap";

// Icons
import {
  BookOpen,
  Clock,
  ImagePlus,
  Layers,
  Loader2,
  Target,
  Trash2,
  CheckCircle2,
  Info,
  UploadCloud,
  Link,
} from "lucide-react";

// ===== Schema giữ nguyên logic =====
const CourseCreateRequestSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  duration: z.string().min(1, "Thời lượng là bắt buộc"),
  totalHours: z.number(),
  level: z.array(z.number()).length(2, "Phải nhập đủ khoảng từ - đến"),
  target: z.number().min(0, "Mục tiêu phải lớn hơn 0"),
  metaData: metaDataSchema,
  categoryId: z.any(),
  slug: slugSchema,
  images: z
    .array(ImageSchema)
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),
  benefit: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  urlYoutube: z
    .string()
    .url("URL Youtube không hợp lệ")
    .min(1, "Bắt buộc nhập URL Youtube"),
  descriptionSidebar: z.string().min(1, "Bắt buộc nhập mô tả sidebar"),
  routeId: z.any(),
});

type CourseCreateRequest = z.infer<typeof CourseCreateRequestSchema>;

type Props = {
  categoryId: number;
  onSubmitForm: (data: FormData) => void;
};
export default function CreateCourseForm({ categoryId, onSubmitForm }: Props) {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<z.infer<typeof RoadmapSchema>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  // Lợi ích
  const [benefits, setBenefits] = useState<
    { title: string; description: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<CourseCreateRequest>({
    resolver: zodResolver(CourseCreateRequestSchema),
    defaultValues: {
      level: [0, 0],
      benefit: [],
      categoryId: categoryId ?? undefined,
    },
  });

  useEffect(() => {
    if (categoryId != null) {
      setValue("categoryId", categoryId, { shouldValidate: true });
    }
  }, [categoryId, setValue]);

  const levelValue = watch("level");
  const previews = useMemo(
    () => uploadedImages.map((f) => URL.createObjectURL(f)),
    [uploadedImages]
  );

  // ----- Fetch roadmaps -----
  useEffect(() => {
    (async () => {
      const resRoadmaps = await clientHttp(
        ApiResponseSchema(RoadmapSchema.array()),
        {
          path: "/route",
          method: "GET",
          query: { limit: 1000 },
        }
      );
      if (Array.isArray(resRoadmaps.data)) {
        setRoadmaps(resRoadmaps.data);
      } else {
        setRoadmaps([]);
      }
    })();
  }, []);

  // ----- Image handlers -----
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const next = [...uploadedImages, ...Array.from(files)].slice(0, 5);
    setUploadedImages(next);
    setValue("images", next as any, { shouldValidate: true });
    trigger("images");
  };

  const handlePressImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOgImage(file);
    setOgImagePreview(URL.createObjectURL(file));
  };

  const removeImage = (index: number) => {
    const next = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(next);
    setValue("images", next as any, { shouldValidate: true });
  };

  // ----- Benefits handlers -----
  const addBenefit = () => {
    setBenefits((s) => [...s, { title: "", description: "" }]);
  };

  const updateBenefit = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setBenefits((s) => {
      const clone = [...s];
      clone[index][field] = value;
      return clone;
    });
  };
  const removeBenefit = (index: number) => {
    setBenefits((s) => s.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const onSubmit = async (data: CourseCreateRequest) => {
    const formData = new FormData();

    // Benefit phẳng (title + description)
    const benefitFlat: string[] = [];
    benefits.forEach((b) => {
      if (b.title) benefitFlat.push(b.title);
      if (b.description) benefitFlat.push(b.description);
    });

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("duration", data.duration);
    formData.append("totalHours", String(data.totalHours || 10));
    formData.append("metaData", JSON.stringify(data.metaData));
    formData.append("type", "COURSE");

    formData.append("urlYoutube", data.urlYoutube);
    formData.append("descriptionSidebar", data.descriptionSidebar);
    formData.append("categoryId", String(categoryId ?? data.categoryId));

    data.level.forEach((num, i) => {
      formData.append(`level[${i}]`, String(Number(num)));
    });

    formData.append("target", JSON.stringify(data.target));
    formData.append("slug", data.slug);

    if (benefitFlat.length) {
      formData.append("benefit", JSON.stringify(benefits));
    }

    formData.append("routeId", data.routeId);

    // Images
    if (Array.isArray(data.images)) {
      let finalImages = [...data.images];
      if (ogImage) {
        // ép pressFile vào vị trí thứ 2
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

    onSubmitForm(formData);
  };

  return (
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
            <label className="text-sm font-medium">Tiêu đề khóa học *</label>
            <div className="relative">
              <input
                type="text"
                {...register("title")}
                className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="VD: Web Frontend từ A-Z"
              />
              <BookOpen className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
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

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Mô tả *</label>
            <textarea
              rows={4}
              {...register("description")}
              className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Mô tả ngắn gọn nội dung & mục tiêu khóa học"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" /> Thời lượng *
            </label>
            <input
              type="text"
              placeholder="VD: 8 tuần, 3 tháng..."
              {...register("duration")}
              className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.duration ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          {/* Total hours */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tổng số giờ *</label>
            <input
              type="number"
              step="0.5"
              {...register("totalHours", { valueAsNumber: true })}
              className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.totalHours ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="VD: 48"
            />
            {errors.totalHours && (
              <p className="text-sm text-red-500">
                {errors.totalHours.message}
              </p>
            )}
          </div>

          {/* Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mức độ *</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.5"
                value={levelValue?.[0] ?? ""}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? 0 : parseFloat(e.target.value);
                  setValue("level", [val, levelValue?.[1] ?? 0], {
                    shouldValidate: true,
                  });
                }}
                className={`w-24 rounded-xl border px-3 py-2.5 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.level ? "border-red-500" : "border-gray-200"
                }`}
              />
              <span className="text-gray-500">đến</span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={levelValue?.[1] ?? ""}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? 0 : parseFloat(e.target.value);
                  setValue("level", [levelValue?.[0] ?? 0, val], {
                    shouldValidate: true,
                  });
                }}
                className={`w-24 rounded-xl border px-3 py-2.5 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.level ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            <div className="text-xs text-gray-500">
              Gợi ý: 0 = Beginner, 5 = Intermediate, 10 = Advanced
            </div>
            {errors.level && (
              <p className="text-sm text-red-500">{errors.level.message}</p>
            )}
          </div>

          {/* Target */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Target className="h-4 w-4 text-gray-500" /> Mục tiêu *
            </label>
            <input
              type="number"
              step="0.1"
              {...register("target", { valueAsNumber: true })}
              className={`w-full rounded-xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.target ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="VD: 9.5"
            />
            {errors.target && (
              <p className="text-sm text-red-500">{errors.target.message}</p>
            )}
          </div>

          {/* Roadmap */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Lộ trình</label>
            {roadmaps.length === 0 ? (
              <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
                Chưa có lộ trình nào
              </div>
            ) : (
              <select
                {...register("routeId", {
                  required: "Vui lòng chọn lộ trình",
                })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn lộ trình --</option>
                {roadmaps.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            )}
            {errors.routeId && (
              <p className="text-sm text-red-500">{`${errors.routeId.message}`}</p>
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
      </section>

      {/* Card: Lợi ích */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <header className="mb-5 flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold">
              Lợi ích khóa học (tùy chọn)
            </h2>
          </div>
          <button
            type="button"
            onClick={addBenefit}
            className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            + Thêm lợi ích
          </button>
        </header>

        <div className="space-y-4">
          {benefits.length === 0 && (
            <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
              Chưa có lợi ích nào. Nhấn <b>+ Thêm lợi ích</b> để bắt đầu.
            </div>
          )}

          {benefits.map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border p-4 shadow-sm transition hover:shadow"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiêu đề</label>
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) => updateBenefit(i, "title", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Kỹ năng thực chiến"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mô tả</label>
                  <textarea
                    rows={2}
                    value={b.description}
                    onChange={(e) =>
                      updateBenefit(i, "description", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả ngắn gọn lợi ích này"
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeBenefit(i)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Youtube URL */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">
          Youtube URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("urlYoutube", {
            required: "Bắt buộc nhập URL Youtube",
          })}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: https://www.youtube.com/watch?v=abc123xyz00"
        />
        {errors.urlYoutube && (
          <p className="text-sm text-red-500">{errors.urlYoutube.message}</p>
        )}
      </div>

      {/* Description Sidebar */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">
          Mô tả Sidebar <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          {...register("descriptionSidebar", {
            required: "Bắt buộc nhập mô tả sidebar",
          })}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nội dung ngắn sẽ hiển thị ở sidebar."
        />
        {errors.descriptionSidebar && (
          <p className="text-sm text-red-500">
            {errors.descriptionSidebar.message}
          </p>
        )}
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
              <label className="text-sm font-medium">Meta Description *</label>
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
                  onChange={handlePressImageChange}
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
              Tạo khóa học
            </>
          )}
        </button>
      </div>
    </form>
  );
}
