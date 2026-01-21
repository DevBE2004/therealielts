"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema } from "@/types";
import {
  ConsultationCreateRequest,
  ConsultationSchema,
} from "@/types/consultation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  Trash2,
  User,
  Mail,
  Smartphone,
  Calendar,
  Target,
  AlertCircle,
  AlarmClock,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";

export default function ConsultationManagerPage() {
  const [loading, setLoading] = useState(false);
  const [consultations, setConsultations] = useState<
    z.infer<typeof ConsultationSchema>[]
  >([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientHttp(
        ApiResponseSchema(ConsultationSchema.array()),
        {
          path: "/consultation",
          method: "GET",
          query: { page, limit },
        }
      );
      if (res.success && Array.isArray(res.data) && res.total) {
        setConsultations(res.data);
        setTotal(res.total);
      } else {
        setConsultations([]);
      }
    } catch (error) {
      console.error("fetch consultation failed", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const handleDeleteConsultation = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn tư vấn này?")) return;
    try {
      await clientHttp(z.any(), {
        path: `/consultation/delete/${id}`,
        method: "DELETE",
      });
      toast.success("Xóa đơn tư vấn thành công");
      setConsultations((prev) =>
        prev.filter((c: ConsultationCreateRequest) => c.id !== id)
      );
      await fetchConsultations();
    } catch (error: any) {
      console.error("ERROR: ", error);
      toast.warning(error.message?.mes || "Chỉ admin mới có quyền xóa!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn tư vấn</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Đang tải dữ liệu...</p>
      ) : consultations.length === 0 ? (
        <p className="text-gray-500 text-center">Chưa có đơn tư vấn nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(consultations) &&
            consultations.map((c) => (
              <div
                key={c.id}
                className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <User size={20} className="shrink-0" /> {c.name}
                  </h2>

                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail size={16} className="shrink-0" />
                    Mail: {c.email}
                  </p>

                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <Smartphone size={16} className="shrink-0" />
                    Phone: {c.mobile}
                  </p>

                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={16} className="shrink-0" />
                    Năm sinh: {c.yearOfBirth}
                  </p>

                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <Target size={16} className="shrink-0" />
                    Mục đích học tiếng anh: {c.goal}
                  </p>

                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <AlarmClock size={16} className="shrink-0" />
                    Thời gian có thể nhận cuộc gọi: {c.schedule}
                  </p>

                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    Lời nhắn: {c.difficult}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      c.id !== undefined && handleDeleteConsultation(c.id)
                    }
                    className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      <Pagination
        currentPage={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
