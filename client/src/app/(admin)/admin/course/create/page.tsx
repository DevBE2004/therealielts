"use client";

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import {
  ApiResponseSchema,
  ImageSchema,
  metaDataSchema,
  slugSchema,
} from "@/types";
import slugify from "slugify";

// Icons
import { BookOpen, Info } from "lucide-react";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import { Category, CategorySchema } from "@/types/category";
import CreateCourseForm from "./CourseCreateForm";
import CreatePackageForm from "./PackageCreateForm";

const PackageCreateRequestSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  slug: slugSchema,
  description: z.string().min(1, "Mô tả là bắt buộc"),
  level: z.array(z.number()).length(2),
  urlYoutube: z.string().url(),
  images: z.array(ImageSchema).min(1, "Cần ít nhất 1 ảnh"),
});

// ===== Schema giữ nguyên logic =====
const CourseCreateRequestSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  duration: z.string().min(1, "Thời lượng là bắt buộc"),
  totalHours: z.number(),
  level: z.array(z.number()).length(2, "Phải nhập đủ khoảng từ - đến"),
  target: z.number().min(0, "Mục tiêu phải lớn hơn 0"),
  metaData: metaDataSchema,
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

export default function CreateCourse() {
  const router = useRouter();
  const showSessionExpired = useSessionExpiredDialog();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const res = await clientHttp(ApiResponseSchema(z.array(CategorySchema)), {
        path: "/category",
        method: "GET",
        query: { limit: 1000, page: 1 },
      });
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data.filter((c) => c.group?.name === "khóa học"));
      }
    }

    fetchCategories();
  }, []);

  console.log("SElect category: ", selectedCategory?.id);

  const handleSubmitForm = async (formData: FormData) => {
    try {
      const response = await clientHttp(ApiResponseSchema(z.any()), {
        path: "/common/create",
        method: "POST",
        body: formData,
      });

      if (response.success) {
        toast.success(
          selectedCategory?.name === "course"
            ? "Thêm khóa học thành công!"
            : "Thêm gói học thành công!"
        );
        router.push("/admin/course");
      }
    } catch (err: any) {
      console.log("Error: ", err);
      if (
        slugify(err.message.mes, { lower: true, locale: "vi-VN" }) ===
        "ban-chua-dang-nhap."
      ) {
        await showSessionExpired();
      } else {
        toast.warning(err.message.mes);
      }
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight">
            Tạo Khóa Học Mới
          </h1>
        </div>
        <div className="hidden items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-sm text-blue-700 md:flex">
          <Info className="h-4 w-4" />
          Nhập đầy đủ thông tin, tối thiểu 1 ảnh.
        </div>
      </div>

      {/* Phân loại */}
      <div className="mb-6">
        <label className="text-sm font-medium">Phân loại *</label>
        <select
          onChange={(e) => {
            const cat = categories.find((c) => c.name === e.target.value);
            setSelectedCategory(cat || null);
          }}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5"
        >
          <option value="">-- Chọn phân loại --</option>
          {categories
            .filter((c) => ["course", "package"].includes(c.name))
            .map((c) => (
              <option key={c.id} value={c.name}>
                {c.name === "course" ? "Khóa học" : "Gói học (Package)"}
              </option>
            ))}
        </select>
      </div>

      {!selectedCategory && (
        <div className="p-10 text-center text-gray-500 border border-dashed rounded-xl">
          Vui lòng chọn phân loại trước khi tạo nội dung.
        </div>
      )}

      {selectedCategory?.id && selectedCategory.name === "course" && (
        <CreateCourseForm
          key={selectedCategory.id}
          categoryId={Number(selectedCategory.id)}
          onSubmitForm={handleSubmitForm}
        />
      )}

      {selectedCategory?.id && selectedCategory.name === "package" && (
        <CreatePackageForm
          key={selectedCategory.id}
          categoryId={Number(selectedCategory.id)}
          onSubmitForm={handleSubmitForm}
        />
      )}
    </div>
  );
}
