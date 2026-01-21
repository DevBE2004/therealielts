"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, Course, CourseSchema } from "@/types";
import { z } from "zod";
import { Pencil, Trash2, Clock, Target, BookOpen } from "lucide-react";
import { confirmDelete } from "@/utils/confirmDelete";
import Pagination from "@/components/common/Pagination";
import { toast } from "react-toastify";

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [filter, setFilter] = useState<"all" | "course" | "package">("all"); // ✅ thêm state lọc

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientHttp(ApiResponseSchema(CourseSchema.array()), {
        method: "GET",
        path: "/common",
        query: { page, limit, type: "COURSE" },
      });
      if (Array.isArray(res.data) && res.total) {
        setCourses(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ✅ Lọc dữ liệu tối ưu bằng useMemo
  const filteredCourses = useMemo(() => {
    if (filter === "all") return courses;
    return courses.filter((course) =>
      filter === "course"
        ? course?.category?.name?.toLowerCase().includes("course")
        : course?.category?.name?.toLowerCase().includes("package")
    );
  }, [courses, filter]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa thông tin khóa học?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      const res = await clientHttp(ApiResponseSchema(z.any()), {
        method: "DELETE",
        path: `/common/delete/${id}`,
      });
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        await fetchCourses();
      }
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* --- Header + Bộ lọc --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>

        {/* --- Nút lọc --- */}
        <div className="flex items-center gap-2">
          {[
            { label: "Tất cả", value: "all" },
            { label: "Khóa học", value: "course" },
            { label: "Gói học", value: "package" },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() =>
                setFilter(btn.value as "all" | "course" | "package")
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === btn.value
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* --- Nút thêm khóa học --- */}
        <Link
          href="/admin/course/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium shadow"
        >
          + Thêm Khóa Học
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải...</p>
      ) : filteredCourses.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={course.images?.[0] || "/placeholder.png"}
                alt={course.title}
                className="h-40 w-full object-cover rounded-xl mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                {course.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.description || "Chưa có mô tả"}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock size={16} /> {course.duration}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Target size={16} />
                  {typeof course.target === "number"
                    ? Number.isInteger(course.target)
                      ? course.target.toFixed(1)
                      : course.target
                    : "N/A"}{" "}
                  IELTS
                </div>
                {course.totalHours !== 0 && (
                  <div className="flex items-center gap-1">
                    ⏱ {course.totalHours?.toFixed?.(2)}h
                  </div>
                )}
              </div>

              {/* --- Quản lý buổi học --- */}
              {course.category !== undefined &&
                course.category?.name === "course" && (
                  <Link
                    href={`/admin/course/lesson/${course.slug}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 text-sm font-medium transition"
                  >
                    <BookOpen size={16} />
                    Quản lý buổi học
                  </Link>
                )}

              <div className="mt-auto flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/course/${course.slug}`}
                    className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id ?? 0)}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Pagination
            currentPage={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">Không tìm thấy khóa học.</p>
      )}
    </div>
  );
}
