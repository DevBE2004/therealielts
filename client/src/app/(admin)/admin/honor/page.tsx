"use client";

import Link from "next/link";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, HonorSchema } from "@/types";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import Image from "next/image";
import { confirmDelete } from "@/utils/confirmDelete";
import { toast } from "react-toastify";

export default function HonorManagerPage() {
  const [honors, setHonors] = useState<z.infer<typeof HonorSchema>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchHonors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientHttp(ApiResponseSchema(HonorSchema.array()), {
        method: "GET",
        path: "/honor",
        query: { page, limit },
      });
      if (res.success && Array.isArray(res.data) && res.total) {
        setHonors(res.data);
        setTotal(res.total);
      } else {
        throw new Error("Failed to fetch honors");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHonors();
  }, [fetchHonors]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa thông tin học viên?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      await clientHttp(ApiResponseSchema(z.any()), {
        method: "DELETE",
        path: `/honor/delete/${id}`,
      });
      setHonors((prev) => prev.filter((h) => h?.id !== id));
      await fetchHonors();
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Honor Management</h1>
        <Link
          href="/admin/honor/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 shadow-md transition"
        >
          + Add New
        </Link>
      </div>

      {/* Grid cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {honors.map((h) => (
          <div
            key={h.id}
            className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center text-start hover:shadow-xl transition"
          >
            <Image
              src={
                h.photo ?? "/images/Uu-diem-vuot-troi-cua-phuong-phap-LCLT.webp"
              }
              alt={h.name}
              width={120}
              height={120}
            />
            <h2 className="text-lg font-semibold text-gray-900 mb-0.5">
              {h.name}
            </h2>
            <p className="text-sm text-gray-500">
              <span className="text-gray-700">Email:</span> {h.email}
            </p>
            <p className="text-sm text-gray-500">
              <span className="text-gray-700">Mobile:</span> {h.mobile}
            </p>

            <div className="w-full mt-2 flex flex-col">
              <h3 className="px-1.5 text-sm font-medium text-start text-gray-700">
                Thành tích
              </h3>
              {h.achievement && (
                <p className="text-sm text-gray-600 break-words line-clamp-4 ">
                  {h.achievement}
                </p>
              )}
            </div>
            <div className="w-full mt-1 flex flex-col">
              <h3 className="px-1.5 text-sm font-medium text-start text-gray-700">
                Giới thiệu
              </h3>
              {h.description && (
                <p className="text-sm text-gray-600 break-words line-clamp-4 ">
                  {h.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <Link
                href={`/admin/honor/${h.id}`}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              >
                <Edit size={16} /> Edit
              </Link>
              <button
                onClick={() => handleDelete(h.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
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
