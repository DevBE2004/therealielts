"use client";

import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, ExamRegistrationSchema } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  Loader2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  FileText,
  User,
  CheckCircle2,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { urlToFile } from "@/utils/urlToFile";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ExamRegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [examRegistration, setExamRegistration] = useState<
    z.infer<typeof ExamRegistrationSchema>[]
  >([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [previewBill, setPreviewBill] = useState(false);

  const fetchExamRegistration = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientHttp(
        ApiResponseSchema(ExamRegistrationSchema.array()),
        {
          path: "/exam-registration",
          method: "GET",
          query: { page, limit },
        }
      );
      if (res.success && Array.isArray(res.data) && res.total) {
        setExamRegistration(res.data);
        setTotal(res.total);
      } else {
        setExamRegistration([]);
      }
    } catch (error) {
      console.error("fetch exam registration failed", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchExamRegistration();
  }, [fetchExamRegistration]);

  const handleConfirm = async (id: number, current: boolean) => {
    const confirmMsg = current
      ? "Hủy xác nhận đơn đăng ký này?"
      : "Xác nhận đơn đăng ký này?";
    if (!confirm(confirmMsg)) return;

    const found = examRegistration.find((e) => e.id === id);
    if (!found) return toast.error("Không tìm thấy bản ghi!");

    try {
      const { id, createdAt, updatedAt, ...rest } = found;
      const updatedData = { ...rest, isConfirmed: !current };

      // 🧩 Khởi tạo FormData
      const formData = new FormData();

      // Duyệt qua tất cả key để append vào FormData
      for (const [key, value] of Object.entries(updatedData)) {
        if (value === null || value === undefined) continue;

        if (key === "bill" && typeof value === "string") {
          const file = await urlToFile(value, "bill.jpg");
          formData.append("bill", file);
        } else if (value instanceof File) {
          // Nếu bill đã là File
          formData.append("bill", value);
        } else {
          formData.append(key, String(value));
        }
      }

      // 🛰️ Gửi API cập nhật
      const res = await clientHttp(z.any(), {
        path: `/exam-registration/update/${id}`,
        method: "PUT",
        body: formData,
      });

      if (res.success) {
        toast.success(
          !current
            ? "Đã xác nhận đơn đăng ký thành công!"
            : "Đã hủy xác nhận đơn đăng ký!"
        );

        setExamRegistration((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isConfirmed: !current } : item
          )
        );
      }
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error(err.message?.mes || "Không thể cập nhật trạng thái!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn đăng ký này?")) return;
    try {
      await clientHttp(z.any(), {
        path: `/exam-registration/delete/${id}`,
        method: "DELETE",
      });
      toast.success("Xóa đơn đăng ký thành công");
      setExamRegistration((prev) => prev.filter((c: any) => c.id !== id));
      await fetchExamRegistration();
    } catch (error: any) {
      console.error("ERROR: ", error);
      toast.warning(error.message?.mes || "Chỉ admin mới có quyền xóa!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Danh sách đơn đăng ký thi
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      ) : examRegistration.length === 0 ? (
        <p className="text-gray-500">Chưa có đơn đăng ký nào</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {examRegistration.map((exam) => (
            <div
              key={exam?.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {exam?.name}
                </h2>

                <div className="flex items-center text-gray-600 text-sm">
                  <Mail className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
                  {exam?.email}
                </div>

                <div className="flex items-center text-gray-600 text-sm">
                  <Phone className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                  {exam?.mobile}
                </div>

                {exam.registrationObject && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-orange-500 shrink-0" />
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">
                      {exam.registrationObject}
                    </span>
                  </div>
                )}

                {exam.createdAt && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500 shrink-0" />
                    {new Date(exam.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                )}

                {exam.bill && (
                  <div className="mt-3">
                    <div className="flex items-center mb-1 text-sm text-gray-600">
                      <FileText className="w-4 h-4 mr-2 text-red-500 shrink-0" />
                      Hóa đơn
                    </div>

                    {typeof exam.bill === "string" &&
                    exam.bill.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={exam.bill}
                        alt="Bill"
                        className="rounded-lg border w-full max-h-40 object-contain cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setPreviewBill(true)}
                      />
                    ) : (
                      <a
                        href={exam.bill as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        Xem tệp
                      </a>
                    )}
                  </div>
                )}

                {/* Dialog preview ảnh */}
                <Dialog open={previewBill} onOpenChange={setPreviewBill}>
                  <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
                    <img
                      src={exam.bill}
                      alt="Bill preview"
                      className="w-full h-auto rounded-lg object-contain"
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* --- Hành động --- */}
              <div className="mt-5 flex gap-3">
                {/* ✅ Nút xác nhận / hủy xác nhận */}
                <button
                  onClick={() =>
                    exam.id && handleConfirm(exam.id, !!exam.isConfirmed)
                  }
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      exam.isConfirmed
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-blue-100 hover:text-blue-700"
                    }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      exam.isConfirmed ? "text-emerald-600" : "text-blue-600"
                    }`}
                  />
                  {exam.isConfirmed ? "Đã xác nhận" : "Xác nhận"}
                </button>

                {/* 🗑️ Nút xóa */}
                <button
                  onClick={() => exam.id && handleDelete(exam.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
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
