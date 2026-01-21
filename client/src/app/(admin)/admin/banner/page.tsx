"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { ApiResponseSchema, Banner, BannerSchema } from "@/types";
import { clientHttp } from "@/lib/clientHttp";
import { confirmDelete } from "@/utils/confirmDelete";
import Pagination from "@/components/common/Pagination";
import {
  Calendar,
  CheckCircle,
  Edit,
  Globe,
  Layers,
  Link2,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

export default function BannerManager() {
  const [banners, setBanners] = useState<z.infer<typeof BannerSchema>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientHttp(ApiResponseSchema(BannerSchema.array()), {
        path: "/banner",
        method: "GET",
        query: { page, limit },
      });
      console.log("Fetched banners: ", res);
      if (Array.isArray(res.data) && res.total) {
        setBanners(res.data);
        setTotal(res.total);
      } else {
        setBanners([]);
      }
    } catch (error) {
      setError("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // delete banner
  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa banner?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      await clientHttp(z.any(), {
        path: `/banner/delete/${id}`,
        method: "DELETE",
      });
      setBanners((prev) => prev.filter((b: Banner) => b?.id !== id));
      await fetchBanners();
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Quản lý Banner</h1>
        <Link
          href="/admin/banner/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm"
        >
          + Thêm Banner
        </Link>
      </div>

      {/* Error / Loading */}
      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {banners.length > 0 ? (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              {/* Image */}
              <img
                src={banner.image || "/placeholder.png"}
                alt={banner.title}
                className="h-40 w-full object-cover"
              />

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  {banner.title}
                </h3>

                {/* Category */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  {banner.category}
                </p>

                {/* ForWeb */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-green-500" /> Site hiển thị:{" "}
                  {banner.forWeb}
                </p>

                {/* URL */}
                <a
                  href={banner.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 truncate flex items-center gap-2 mb-1"
                >
                  <Link2 className="w-4 h-4" />
                  {banner.url}
                </a>

                {/* Status */}
                <div className="flex items-center gap-2 mt-2">
                  {banner.isActive ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> Hiển thị
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <XCircle className="w-4 h-4" /> Ẩn
                    </span>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" /> Updated:{" "}
                  {new Date(
                    banner.updatedAt ?? Date.now()
                  ).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-4">
                  <Link
                    href={`/admin/banner/${banner.slug}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" /> Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(banner.id)}
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
            Không có banner nào.
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
