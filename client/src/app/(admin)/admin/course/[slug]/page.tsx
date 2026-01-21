"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import slugify from "slugify";

// Icons
import { BookOpen, Info } from "lucide-react";
import { toast } from "react-toastify";
import useSessionExpiredDialog from "@/components/common/SessionExpiredDialog";
import UpdateCourseForm from "./CourseUpdateForm";
import UpdatePackageForm from "./PackageUpdateForm";

export default function UpdateCourse() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  console.log(slug);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);
  const showSessionExpired = useSessionExpiredDialog();

  // Load dữ liệu course hiện tại
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientHttp(ApiResponseSchema(z.any()), {
          path: `/common/${slug}`,
          method: "GET",
        });

        if (res.success && res.data) {
          setCourseData(res.data);
        }
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu!");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  // ----- Submit giữ nguyên logic -----
  const handleSubmitForm = async (formData: FormData) => {
    if (!courseData.id) return;

    try {
      const response = await clientHttp(ApiResponseSchema(z.any()), {
        path: `/common/update/${courseData.id}`,
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

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Đang tải dữ liệu khóa học...
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="p-10 text-center text-gray-500 border border-dashed rounded-xl">
        Không tìm thấy dữ liệu phù hợp.
      </div>
    );
  }

  const categoryName = courseData?.category?.name;

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight">
            Chỉnh Sửa Thông Tin{" "}
            {categoryName === "course" ? "Khóa Học" : "Gói Học"}
          </h1>
        </div>
        <div className="hidden items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-sm text-blue-700 md:flex">
          <Info className="h-4 w-4" />
          Nhập đầy đủ thông tin, tối thiểu 1 ảnh.
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium">Phân loại</label>
        <input
          value={categoryName === "course" ? "Khóa học" : "Gói học (Package)"}
          readOnly
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 cursor-not-allowed"
        />
      </div>

      {categoryName === "course" && (
        <UpdateCourseForm
          onSubmitUpdate={handleSubmitForm}
          initialData={courseData}
        />
      )}
      {categoryName === "package" && (
        <UpdatePackageForm
          onSubmitUpdate={handleSubmitForm}
          initialData={courseData}
        />
      )}
    </div>
  );
}
