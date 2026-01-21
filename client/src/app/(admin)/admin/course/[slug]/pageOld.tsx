"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  CourseSchema,
  ImageSchema,
  metaDataSchema,
  slugSchema,
} from "@/types";
import slugify from "slugify";
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
  Upload,
  CheckCircle2,
  Info,
  UploadCloud,
  Link,
} from "lucide-react";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";

// ===== Schema giữ nguyên logic =====
const CourseUpdateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  duration: z.string().min(1, "Thời lượng là bắt buộc"),
  totalHours: z.number(),
  level: z
    .array(z.string().or(z.number()))
    .length(2, "Cần 2 giá trị cho mức độ"),
  target: z.number().min(0, "Mục tiêu phải lớn hơn 0"),
  metaData: metaDataSchema,
  slug: slugSchema,
  images: z
    .array(ImageSchema)
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),
  benefit: z.array(z.string().min(1, "Lợi ích không được để trống")).optional(),
   urlYoutube: z
    .string()
    .url("URL Youtube không hợp lệ")
    .min(1, "Bắt buộc nhập URL Youtube"),
  descriptionSidebar: z.string().min(1, "Bắt buộc nhập mô tả sidebar"),
  routeId: z.any(),
});

type CourseUpdate = z.infer<typeof CourseUpdateSchema>;
type Benefit = { title: string; description: string };

export default function UpdateCourse() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  console.log(slug);

  const [id, setId] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roadmaps, setRoadmaps] = useState<z.infer<typeof RoadmapSchema>[]>([]);
  const [benefits, setBenefits] = useState<any[]>([]);

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[] | undefined>(undefined);
  const showSessionExpired = useSessionExpiredDialog();

  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<CourseUpdate>({
    resolver: zodResolver(CourseUpdateSchema),
    defaultValues: {
      level: [0, 0],
      benefit: [],
    },
  });

  console.log("ERRROO: ", errors)

  const urlToFile = async (
    url: string,
    filename: string,
    mimeType = "image/png"
  ): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  };

  // Load dữ liệu course hiện tại
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(CourseSchema), {
          path: `/common/${slug}`,
          method: "GET",
        });
        console.log(res);
        if (res.data) {
          reset({
            title: res.data.title,
            description: res.data.description,
            totalHours: res.data.totalHours || 0,
            duration: res.data.duration || undefined,
            level: res.data.level || [0, 0],
            target: res.data.target || 0,
            routeId: res.data.routeId || "",
            slug: res.data.slug,
            urlYoutube: res.data.urlYoutube,
            descriptionSidebar: res.data.descriptionSidebar,
            metaData: res.data.metaData
          ? {
              metaTitle: res.data.metaData.metaTitle || "",
              metaDescription: res.data.metaData.metaDescription || "",
              metaKeywords: res.data.metaData.metaKeywords || "",
            }
          : { metaTitle: "", metaDescription: "", metaKeywords: "" },
          });

          setId(res.data.id);
          setBenefits(res.data.benefit || []);

          if (res.data.images?.length > 1) {
            // ogImage
            setOgImagePreview(res.data.images[1]);
            // phần preview ảnh chính
            const mainPreviews = res.data.images.filter((_, idx) => idx !== 1);
            setPreviews(mainPreviews);

            // convert sang File[]
            const files = await Promise.all(
              res.data.images.map((imgUrl, idx) =>
                urlToFile(imgUrl, `image-${idx}.png`)
              )
            );
            // bỏ pressFile ra khỏi mảng images chính
            const mainFiles = files.filter((_, idx) => idx !== 1);
            setValue("images", mainFiles as any, { shouldValidate: true });
          } else {
            setPreviews(res.data.images);
            const files = await Promise.all(
              res.data.images.map((imgUrl, idx) =>
                urlToFile(imgUrl, `image-${idx}.png`)
              )
            );
            setValue("images", files as any, { shouldValidate: true });
          }

          if (res.data?.benefit) {
            const arr = res.data.benefit as string[];
            const normalized: { title: string; description: string }[] = [];

            for (let i = 0; i < arr.length; i += 2) {
              normalized.push({
                title: arr[i] || "",
                description: arr[i + 1] || "",
              });
            }

            setBenefits(normalized);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu!");
      }
    };
    if (slug) fetchData();
  }, [slug, reset, setValue]);

  const levelValue = watch("level");

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

    const fileArray = Array.from(files).slice(0, 5);
    setValue("images", fileArray as any, { shouldValidate: true });
    trigger("images");
    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
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
    field: keyof Benefit,
    value: string
  ) => {
    const updated = [...benefits];
    updated[index] = { ...updated[index], [field]: value };
    setBenefits(updated);
  };
  const removeBenefit = (index: number) => {
    setBenefits((s) => s.filter((_, i) => i !== index));
  };

  // ----- Submit giữ nguyên logic -----
  const onSubmit = async (data: CourseUpdate) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

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

      // Level gửi theo chuẩn array inputs
      data.level.forEach((num, i) => {
        formData.append(`level[${i}]`, String(Number(num)));
      });

      formData.append("target", JSON.stringify(data.target));
      formData.append("slug", data.slug);

      // Append từng benefit (server gom thành mảng)
      if (benefitFlat.length) {
        benefitFlat.forEach((v) => formData.append("benefit", v));
      }

      formData.append("routeId", data.routeId);

      // Images
      if (Array.isArray(data.images)) {
        let finalImages = [...data.images];

        if (ogImage) {
          finalImages.splice(1, 0, ogImage);
        } else if (ogImagePreview) {
          // nếu không chọn file mới => convert lại preview cũ sang File
          const file = await urlToFile(ogImagePreview, "press-icon.png");
          finalImages.splice(1, 0, file);
        }

        finalImages.forEach((file) => {
          formData.append("images", file);
        });
      }

      for (const [key, value] of formData.entries()) {
        console.log("FormData:", key, value);
      }

      const response = await clientHttp(ApiResponseSchema(z.any()), {
        path: `/common/update/${id}`,
        method: "PUT",
        body: formData,
      });

      if (response.success) {
        toast.success("Cập nhật thành công");
        router.push("/admin/course");
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
          <BookOpen className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight">
            Chỉnh Sửa Khóa Học
          </h1>
        </div>
        <div className="hidden items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-sm text-blue-700 md:flex">
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
                <p className="text-sm text-red-500">
                  {errors.duration.message}
                </p>
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
              <Upload className="h-6 w-6" />
              <span className="text-sm text-gray-600">
                Kéo & thả ảnh vào đây hoặc nhấn để chọn
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
                      value={b.title ?? ""}
                      onChange={(e) =>
                        updateBenefit(i, "title", e.target.value)
                      }
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
            Mô tả Sidebar (Xuống dòng cho mỗi mô tả) <span className="text-red-500">*</span> 
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
                Cập nhật khóa học
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
