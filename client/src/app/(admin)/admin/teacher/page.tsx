"use client";

import Pagination from "@/components/common/Pagination";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, TeacherSchema } from "@/types";
import { confirmDelete } from "@/utils/confirmDelete";
import {
  Award,
  BookOpen,
  Edit,
  Globe,
  GraduationCap,
  Info,
  Mail,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

export default function TeacherManager() {
  const [teachers, setTeachers] = useState<z.infer<typeof TeacherSchema>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientHttp(ApiResponseSchema(TeacherSchema.array()), {
        path: "/teacher",
        method: "GET",
        query: { page, limit },
      });
      await setTeachers(Array.isArray(res.teachers) ? res.teachers.flat() : []);
      setTotal(res.total ? res.total : 0);
    } catch (error) {
      setError("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa thông tin giáo viên?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      const res = await clientHttp(z.any(), {
        path: `/teacher/delete/${id}`,
        method: "DELETE",
      });
      if (res.success) {
        toast.success("Xóa thông tin giáo viên thành công");
        setTeachers((prev) => prev.filter((t) => t.id !== id));
        await fetchTeachers();
      }
    } catch (err: any) {
      toast.warning(err.message?.mes || "Xóa giáo viên thất bại!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Quản lý Giáo viên</h1>
        <Link
          href="/admin/teacher/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm"
        >
          + Thêm Giáo viên
        </Link>
      </div>

      {/* Error / Loading */}
      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              {/* Avatar */}
              <div className="flex justify-center p-4">
                <img
                  src={teacher.avatar || "/placeholder.png"}
                  alt={teacher.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 shadow-sm"
                />
              </div>

              {/* Content */}
              <div className="px-4 pb-4 flex flex-col flex-1">
                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-500" />
                  {teacher.name}
                </h3>

                {/* Email */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1 truncate">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  {teacher.email}
                </p>

                {/* Phone */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-green-500" />
                  {teacher.mobile || "-"}
                </p>

                {/* Education */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-purple-500 shrink-0" />
                  {teacher.education || "-"}
                </p>

                {/* IELTS Score */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  {teacher.ieltsScore !== undefined
                    ? teacher.ieltsScore.toFixed(1)
                    : "Chưa cập nhật"}
                </p>

                {/* Experience */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-pink-500" />
                  {teacher.yearsOfExperience} năm kinh nghiệm
                </p>

                {/* ForWeb */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  {teacher.forWeb || "N/A"}
                </p>

                {/* Bio */}
                <div className="flex items-start gap-2 mt-2">
                  <Info className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                  <p
                    className="text-sm text-gray-500 line-clamp-5"
                    title={teacher.bio}
                  >
                    {teacher.bio || "-"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-4">
                  <Link
                    href={`/admin/teacher/${teacher.id}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" /> Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">
            Không có giáo viên nào.
          </p>
        )}
      </div>
      <Pagination
        currentPage={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
