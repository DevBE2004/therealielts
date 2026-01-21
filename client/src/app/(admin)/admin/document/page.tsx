"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { clientHttp } from "@/lib/clientHttp";
import { z } from "zod";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  User as UserIcon,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { ApiResponseSchema, UserSchema } from "@/types";
import { toast } from "react-toastify";
import { confirmDelete } from "@/utils/confirmDelete";
import Pagination from "@/components/common/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDeBounce";
import { toLowerNonAccent } from "@/hooks/toLowerNonAccent";

const DocumentSchema = z.object({
  id: z.number(),
  author: UserSchema.optional(),
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.number().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

type Document = z.infer<typeof DocumentSchema>;

export default function DocumentManagerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(
    searchParams.get("sort") || "createdAt,DESC"
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);
  const normalizedSearch = toLowerNonAccent(debouncedSearch);

  const updateQueryParams = useCallback(
    (params: Record<string, string | number | undefined>) => {
      const query = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") query.set(key, String(value));
        else query.delete(key);
      });
      router.replace(`?${query.toString()}`);
    },
    [router, searchParams]
  );

  const sortOptions = [
    { label: "Ngày tạo (mới nhất)", value: "createdAt,DESC" },
    { label: "Ngày tạo (cũ nhất)", value: "createdAt,ASC" },
    { label: "Ngày cập nhật (mới nhất)", value: "updatedAt,DESC" },
    { label: "Ngày cập nhật (cũ nhất)", value: "updatedAt,ASC" },
  ];

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientHttp(ApiResponseSchema(DocumentSchema.array()), {
        method: "GET",
        path: "/common",
        query: {
          page,
          limit,
          type: "DOCUMENT",
          search: normalizedSearch || undefined,
          orderBy: sort,
        },
      });
      if (Array.isArray(res.data) && res.total) {
        setDocuments(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, sort]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: number) => {
    const confirm = await confirmDelete(
      "Xác nhận xóa tài liệu?",
      "Bạn sẽ không thể khôi phục sau khi xóa!"
    );
    if (!confirm) return;
    try {
      await clientHttp(z.any(), {
        method: "DELETE",
        path: `/common/delete/${id}`,
      });
      setDocuments((prev) => prev.filter((d: Document) => d?.id !== id));
      await fetchDocuments();
    } catch (err: any) {
      toast.warning(err.message?.mes || "Chỉ Admin mới có quyền xóa!");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Quản lý Tài liệu
        </h1>
        <Link
          href="/admin/document/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition"
        >
          <Plus size={20} /> Thêm Tài liệu
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
            const value = e.target.value;
            setSearch(value);
            setPage(1);
            updateQueryParams({ search: value || undefined, page: 1 });
          }}
          className="px-4 py-2 border rounded-lg flex-1"
        />

        {/* Sort button */}
        <select
          value={sort}
          onChange={(e) => {
            const newSort = e.target.value;
            setSort(newSort);
            setPage(1);
            updateQueryParams({ sort: newSort, page: 1 });
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-blue-400"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Đang tải dữ liệu...</p>
      ) : documents.length ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white shadow hover:shadow-lg transition rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Image Preview */}
                <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {doc.images?.[0] ? (
                    <img
                      src={doc.images?.[0]}
                      alt={doc.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileText size={56} className="text-blue-500" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-5">
                  <h2 className="text-[16px] font-bold text-gray-900 line-clamp-2 mb-2">
                    {doc.title}
                  </h2>
                  <div
                    className="text-[13px] text-gray-600 line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        doc.description ||
                        "<span class='italic text-gray-400'>Không có mô tả</span>",
                    }}
                  />

                  {/* Metadata */}
                  <div className="mt-auto space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" /> Tạo:{" "}
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" /> Cập nhật
                      gần nhất:{" "}
                      {doc.updatedAt
                        ? new Date(doc.updatedAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <UserIcon size={16} className="text-gray-400" /> Bởi:{" "}
                      {doc.author?.name}
                    </p>
                    <p className="flex items-center gap-2">
                      {doc.isActive ? (
                        <>
                          <Eye size={16} className="text-green-500" /> Hoạt động
                        </>
                      ) : (
                        <>
                          <EyeOff size={16} className="text-gray-400" /> Không
                          hoạt động
                        </>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-5 pt-3 border-t">
                    <Link
                      href={`/admin/document/${doc.slug}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                    >
                      <Edit size={16} /> Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            total={total}
            limit={limit}
            onPageChange={(newPage) => {
              setPage(newPage);
              updateQueryParams({ page: newPage });
            }}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          Chưa có tài liệu nào.
        </p>
      )}
    </div>
  );
}
