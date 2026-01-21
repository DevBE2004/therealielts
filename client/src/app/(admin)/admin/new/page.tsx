"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { clientHttp } from "@/lib/clientHttp";
import { ApiResponseSchema, New, NewSchema } from "@/types";
import { z } from "zod";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { confirmDelete } from "@/utils/confirmDelete";
import Pagination from "@/components/common/Pagination";
import { toast } from "react-toastify";

export default function NewManager() {
  const [newsList, setNewsList] = useState<New[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Query state
  const [search, setSearch] = useState("");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientHttp(ApiResponseSchema(NewSchema.array()), {
        method: "GET",
        path: "/common",
        query: { page, limit, type: "NEW", search: search || undefined },
      });
      console.log("Fetched documents:", res.total);
      if (Array.isArray(res.data) && res.total) {
        setNewsList(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa tin tức?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      await clientHttp(z.any(), {
        method: "DELETE",
        path: `/common/delete/${id}`,
      });
      setNewsList((prev) => prev.filter((n: New) => n?.id !== id));
      await fetchNews();
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Tin tức</h1>
        <Link
          href="/admin/new/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition"
        >
          <Plus size={18} /> Thêm Tin Mới
        </Link>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search input */}
        <input
          type="text"
          placeholder="Tìm kiếm tài liệu..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="px-4 py-2 border rounded-lg flex-1"
        />
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : newsList.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white shadow-md hover:shadow-lg transition rounded-xl overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="h-40 bg-gray-100 overflow-hidden">
                <img
                  src={news.images?.[0] || "/placeholder.png"}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-4">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {news.title}
                </h2>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <Tag size={14} className="text-gray-400" /> Loại tin tức:{" "}
                    {news.category?.name || "Chưa phân loại"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-green-500" /> Site hiển thị:{" "}
                    {news.forWeb}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" /> Updated:{" "}
                    {news.updatedAt
                      ? new Date(news.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="flex items-center gap-1">
                    {news.isActive ? (
                      <>
                        <Eye size={14} className="text-green-500" /> Hiển thị
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} className="text-gray-400" /> Ẩn
                      </>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 pt-3 border-t">
                  <Link
                    href={`/admin/new/${news.slug}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                  >
                    <Edit size={16} /> Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(news.id!)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Chưa có tin tức nào.</p>
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
